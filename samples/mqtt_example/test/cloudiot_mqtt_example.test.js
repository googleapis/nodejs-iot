// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const assert = require('assert');
const cp = require('child_process');
const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const iot = require('@google-cloud/iot');
const {PubSub} = require('@google-cloud/pubsub');
const uuid = require('uuid');

const {after, before, it, xit} = require('mocha');

const projectId =
  process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
const topicName = `nodejs-iot-test-mqtt-topic-${uuid.v4()}`;
const registryName = `nodejs-iot-test-mqtt-registry-${uuid.v4()}`;
const region = 'us-central1';
const rsaPublicCert = 'resources/rsa_cert.pem'; //process.env.NODEJS_IOT_RSA_PUBLIC_CERT;
const rsaPrivateKey = 'resources/rsa_private.pem'; //process.env.NODEJS_IOT_RSA_PRIVATE_KEY;
const serverCert = 'resources/roots.pem'; //process.env.NODEJS_IOT_SERVER_CERT;'

const helper = 'node ../manager/manager.js';
const cmd = 'node cloudiot_mqtt_example_nodejs.js';

const cmdSuffix = ` --privateKeyFile=${rsaPrivateKey} --serverCertFile=${serverCert} --algorithm=RS256`;
const installDeps = 'npm install';

const iotClient = new iot.v1.DeviceManagerClient();
const pubSubClient = new PubSub({projectId});

assert.ok(execSync(installDeps, '../manager'));
before(async () => {
  assert(
    process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT,
    'Must set GOOGLE_CLOUD_PROJECT or GCLOUD_PROJECT environment variable!'
  );
  assert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    'Must set GOOGLE_APPLICATION_CREDENTIALS environment variable!'
  );
  // Create a unique topic to be used for testing.
  const [topic] = await pubSubClient.createTopic(topicName);

  // Creates a registry to be used for tests.
  const createRegistryRequest = {
    parent: iotClient.locationPath(projectId, region),
    deviceRegistry: {
      id: registryName,
      eventNotificationConfigs: [
        {
          pubsubTopicName: topic.name,
        },
      ],
    },
  };
  await execSync(`${helper} setupIotTopic ${topicName}`);

  await iotClient.createDeviceRegistry(createRegistryRequest);
});

after(async () => {
  await pubSubClient.topic(topicName).delete();

  // Cleans up the registry by removing all associations and deleting all devices.
  execSync(`${helper} unbindAllDevices ${registryName}`);
  execSync(`${helper} clearRegistry ${registryName}`);
});

it('should receive configuration message', async () => {
  const localDevice = 'test-rsa-device';
  const localRegName = `${registryName}-rsa256`;

  let output = await execSync(`${helper} setupIotTopic ${topicName}`);
  await execSync(`${helper} createRegistry ${localRegName} ${topicName}`);
  await execSync(
    `${helper} createRsa256Device ${localDevice} ${localRegName} ${rsaPublicCert}`
  );

  output = await execSync(
    `${cmd} mqttDeviceDemo --messageType=events --registryId="${localRegName}" --deviceId="${localDevice}" --numMessages=1 ${cmdSuffix}`
  );

  assert.strictEqual(new RegExp('connect').test(output), true);
  assert.strictEqual(new RegExp('Config message received:').test(output), true);

  // Check / cleanup
  await execSync(`${helper} getDeviceState ${localDevice} ${localRegName}`);
  await execSync(`${helper} deleteDevice ${localDevice} ${localRegName}`);
  await execSync(`${helper} deleteRegistry ${localRegName}`);
});

it('should send event message', async () => {
  const localDevice = 'test-rsa-device';
  const localRegName = `${registryName}-rsa256`;

  await execSync(`${helper} setupIotTopic ${topicName}`);
  await execSync(`${helper} createRegistry ${localRegName} ${topicName}`);
  await execSync(
    `${helper} createRsa256Device ${localDevice} ${localRegName} ${rsaPublicCert}`
  );

  const output = await execSync(
    `${cmd} mqttDeviceDemo --messageType=events --registryId="${localRegName}" --deviceId="${localDevice}" --numMessages=1 ${cmdSuffix}`
  );
  assert.strictEqual(new RegExp('Publishing message:').test(output), true);

  // Check / cleanup
  await execSync(`${helper} getDeviceState ${localDevice} ${localRegName}`);
  await execSync(`${helper} deleteDevice ${localDevice} ${localRegName}`);
  await execSync(`${helper} deleteRegistry ${localRegName}`);
});

it('should send state message', async () => {
  const localDevice = 'test-rsa-device';
  const localRegName = `${registryName}-rsa256`;
  await execSync(`${helper} setupIotTopic ${topicName}`);
  await execSync(`${helper} createRegistry ${localRegName} ${topicName}`);
  await execSync(
    `${helper} createRsa256Device ${localDevice} ${localRegName} ${rsaPublicCert}`
  );

  const output = await execSync(
    `${cmd} mqttDeviceDemo --messageType=state --registryId="${localRegName}" --deviceId="${localDevice}" --numMessages=1 ${cmdSuffix}`
  );
  assert.strictEqual(new RegExp('Publishing message:').test(output), true);

  // Check / cleanup
  await execSync(`${helper} getDeviceState ${localDevice} ${localRegName}`);
  await execSync(`${helper} deleteDevice ${localDevice} ${localRegName}`);
  await execSync(`${helper} deleteRegistry ${localRegName}`);
});

xit('should receive command message', async () => {
  const deviceId = 'commands-device';
  const message = 'rotate 180 degrees';

  await execSync(
    `${helper} createRsa256Device ${deviceId} ${registryName} ${rsaPublicCert}`
  );

  const mqttClientExec = exec(
    `${cmd} mqttDeviceDemo --registryId=${registryName} --deviceId=${deviceId} --numMessages=5 --mqttBridgePort=8883 ${cmdSuffix}`
  );

  await execSync(
    `${helper} sendCommand ${deviceId} ${registryName} "${message}"`
  );

  const {stdout} = await mqttClientExec;

  assert.strictEqual(
    new RegExp(`Command message received: ${message}`).test(stdout.toString()),
    true
  );

  // Cleanup
  await iotClient.deleteDevice({
    name: iotClient.devicePath(projectId, region, registryName, deviceId),
  });
});

it('should listen for bound device config message', async () => {
  const gatewayId = 'nodejs-test-gateway-cm';
  await execSync(
    `${helper} createGateway --registryId=${registryName} --gatewayId=${gatewayId} --publicKeyFormat=RSA_X509_PEM --publicKeyFile=${rsaPublicCert}`
  );

  const deviceId = 'nodejs-test-device-cm';
  await execSync(`${helper} createUnauthDevice  ${deviceId} ${registryName}`);

  await execSync(
    `${helper} bindDeviceToGateway ${registryName} ${gatewayId} ${deviceId}`
  );

  // listen for configuration changes
  const out = await execSync(
    `${cmd} listenForConfigMessages --deviceId=${deviceId} --gatewayId=${gatewayId} --registryId=${registryName} --clientDuration=10000 ${cmdSuffix}`
  );

  assert.strictEqual(new RegExp('message received').test(out), true);

  // cleanup
  await execSync(
    `${helper} unbindDeviceFromGateway ${registryName} ${gatewayId} ${deviceId}`
  );
  await execSync(`${helper} deleteDevice ${gatewayId} ${registryName}`);
  await execSync(`${helper} deleteDevice ${deviceId} ${registryName}`);
});

it('should listen for error topic messages', async () => {
  const gatewayId = `nodejs-test-gateway-err-${uuid.v4()}`;
  await execSync(
    `${helper} createGateway --registryId=${registryName} --gatewayId=${gatewayId} --publicKeyFormat=RSA_X509_PEM --publicKeyFile=${rsaPublicCert}`
  );

  // create a device but don't associate it with the gateway
  const deviceId = `nodejs-test-device-err-${uuid.v4()}`;
  await execSync(
    `${helper} createRsa256Device ${deviceId} ${registryName} ${rsaPublicCert}`
  );

  // check error topic contains error of attaching a device that is not bound
  const out = await cp.execSync(
    `${cmd} listenForErrorMessages --gatewayId=${gatewayId} --registryId=${registryName} --deviceId=${deviceId} --clientDuration=30000 ${cmdSuffix}`
  );

  const stdout = Buffer.from(out).toString();

  assert.strictEqual(
    new RegExp('message received on error topic').test(stdout),
    true
  );

  // cleanup
  await execSync(
    `${helper} unbindDeviceFromGateway ${registryName} ${gatewayId} ${deviceId}`
  );
  await execSync(`${helper} deleteDevice ${gatewayId} ${registryName}`);
  await execSync(`${helper} deleteDevice ${deviceId} ${registryName}`);
});

xit('should send data from bound device', async () => {
  const gatewayId = `nodejs-test-gateway-sdbd-${uuid.v4()}`;
  await execSync(
    `${helper} createGateway --registryId=${registryName} --gatewayId=${gatewayId} --publicKeyFormat=RSA_X509_PEM --publicKeyFile=${rsaPublicCert}`
  );

  const deviceId = `nodejs-test-sdbd-${uuid.v4()}`;
  await iotClient.createDevice({
    parent: iotClient.registryPath(projectId, region, registryName),
    device: {
      id: deviceId,
    },
  });

  await execSync(
    `${helper} bindDeviceToGateway ${registryName} ${gatewayId} ${deviceId}`
  );

  // relay telemetry on behalf of device
  const out = await execSync(
    `${cmd} sendDataFromBoundDevice --deviceId=${deviceId} --gatewayId=${gatewayId} --registryId=${registryName} --numMessages=5`
  );

  assert.strictEqual(new RegExp('Publishing message 5/5').test(out), true);
  assert.strictEqual(new RegExp('Error: Connection refused').test(out), false);

  await execSync(
    `${helper} unbindDeviceFromGateway ${registryName} ${gatewayId} ${deviceId}`
  );
  await execSync(`${helper} deleteDevice ${gatewayId} ${registryName}`);
  await execSync(`${helper} deleteDevice ${deviceId} ${registryName}`);
});
