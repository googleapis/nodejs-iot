// Copyright 2021 Google LLC
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
const { readFileSync } = require('fs');
const iot = require('@google-cloud/iot');
const path = require('path');
const { PubSub } = require('@google-cloud/pubsub');
const cp = require('child_process');
const cwd = path.join(__dirname, '..');
const execSync = cmd => cp.execSync(cmd, { encoding: 'utf-8' });
const installDeps = 'npm install';
const uuid = require('uuid');
const { after, before, it } = require('mocha');

const deviceId = 'test-node-device';
const topicName = `nodejs-docs-samples-test-iot-${uuid.v4()}`;
const registryName = `nodejs-test-registry-iot-${uuid.v4()}`;
const region = 'us-central1';
const projectId =
  process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;

const helper = 'node ../manager/manager.js';
const cmd = `node access_token.js generateGcpAccessToken ${registryName} ${deviceId}`;
const rsaPublicCert = '../resources/rsa_cert.pem'; // process.env.NODEJS_IOT_RSA_PUBLIC_CERT;
const rsaPrivateKey = '../resources/rsa_private.pem'; //process.env.NODEJS_IOT_RSA_PRIVATE_KEY;

const iotClient = new iot.v1.DeviceManagerClient({ servicePath: 'cloudiottoken.googleapis.com' });
const pubSubClient = new PubSub({ projectId });

before(async () => {
  execSync(installDeps, `${cwd}/manager`);
  assert(
    process.env.GCLOUD_PROJECT,
    'Must set GCLOUD_PROJECT environment variable!'
  );
  assert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    'Must set GOOGLE_APPLICATION_CREDENTIALS environment variable!'
  );
  // Create a topic to be used for testing.
  const [topic] = await pubSubClient.createTopic(topicName);
  console.log(`Topic ${topic.name} created.`);

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
  await execSync(`${helper} setupIotTopic ${topicName}`, cwd);

  await iotClient.createDeviceRegistry(createRegistryRequest);

  console.log(`Created registry: ${registryName}`);
  async function createDevice() {
    // Construct request
    const regPath = iotClient.registryPath(projectId, region, registryName);
    const device = {
      id: deviceId,
      credentials: [
        {
          publicKey: {
            format: 'RSA_X509_PEM',
            key: readFileSync(rsaPublicCert).toString(),
          },
        },
      ],
    };

    const request = {
      parent: regPath,
      device,
    };

    const [response] = await iotClient.createDevice(request);
    console.log('Created device', response);
  }

  createDevice();
  console.log(`Created Device: ${deviceId}`);
});

after(async () => {
  await pubSubClient.topic(topicName).delete();
  console.log(`Topic ${topicName} deleted.`);
  const devPath = iotClient.devicePath(
    projectId,
    region,
    registryName,
    deviceId
  );

  await iotClient.deleteDevice({ name: devPath });

  console.log(`Device ${deviceId} deleted.`);

  const registryPath = iotClient.registryPath(
    projectId,
    region,
    registryName
  );
  await iotClient.deleteDeviceRegistry({
    name: registryPath,
  });
  console.log('Deleted test registry.');
});

it('should generate gcp access token', async () => {
  const output = await execSync(
    `${cmd} --certificateFile=${rsaPrivateKey} --scopes="scope1 scope2"`, cwd
  );

  //assert.strictEqual(new RegExp(/Publishing message/).test(output), true);
});
