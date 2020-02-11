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

const {PubSub} = require('@google-cloud/pubsub');
const assert = require('assert');
const cp = require('child_process');
const path = require('path');
const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});
const uuid = require('uuid');

const deviceId = 'test-node-device';
const topicName = `nodejs-docs-samples-test-iot-${uuid.v4()}`;
const registryName = `nodejs-test-registry-iot-${uuid.v4()}`;
const helper = 'node ../manager/manager.js';
const cmd = `node cloudiot_http_example.js --registryId="${registryName}" --deviceId="${deviceId}" `;
const cwd = path.join(__dirname, '..');
const installDeps = 'npm install';

assert.ok(execSync(installDeps, `${cwd}/../manager`));
before(async () => {
  assert(
    process.env.GCLOUD_PROJECT,
    `Must set GCLOUD_PROJECT environment variable!`
  );
  assert(
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    `Must set GOOGLE_APPLICATION_CREDENTIALS environment variable!`
  );
  const pubsub = new PubSub();
  const [topic] = await pubsub.createTopic(topicName);
  console.log(`Topic ${topic.name} created.`);
});

after(async () => {
  const pubsub = new PubSub();
  const topic = pubsub.topic(topicName);
  await topic.delete();
  console.log(`Topic ${topic.name} deleted.`);
});

it('should receive configuration message', async () => {
  const localDevice = 'test-rsa-device';
  const localRegName = `${registryName}-rsa256`;

  await execSync(`${helper} setupIotTopic ${topicName}`, cwd);
  await execSync(
    `${helper} createRegistry ${localRegName} ${topicName}`,
    cwd
  );
  await execSync(
    `${helper} createRsa256Device ${localDevice} ${localRegName} resources/rsa_cert.pem`,
    cwd
  );

  const output = await execSync(
    `${cmd} --messageType=events --numMessages=1 --privateKeyFile=resources/rsa_private.pem --algorithm=RS256`,
    cwd
  );

  assert.strictEqual(new RegExp(/Getting config/).test(output), true);

  // Check / cleanup
  await execSync(
    `${helper} getDeviceState ${localDevice} ${localRegName}`,
    cwd
  );
  await execSync(
    `${helper} deleteDevice ${localDevice} ${localRegName}`,
    cwd
  );
  await execSync(`${helper} deleteRegistry ${localRegName}`, cwd);
});

it('should send event message', async () => {
  const localDevice = 'test-rsa-device';
  const localRegName = `${registryName}-rsa256`;

  await execSync(`${helper} setupIotTopic ${topicName}`, cwd);
  await execSync(
    `${helper} createRegistry ${localRegName} ${topicName}`,
    cwd
  );
  await execSync(
    `${helper} createRsa256Device ${localDevice} ${localRegName} resources/rsa_cert.pem`,
    cwd
  );

  const output = await execSync(
    `${cmd} --messageType=events --numMessages=1 --privateKeyFile=resources/rsa_private.pem --algorithm=RS256`,
    cwd
  );

  assert.strictEqual(new RegExp(/Publishing message/).test(output), true);

  // Check / cleanup
  await execSync(
    `${helper} getDeviceState ${localDevice} ${localRegName}`,
    cwd
  );
  await execSync(
    `${helper} deleteDevice ${localDevice} ${localRegName}`,
    cwd
  );
  await execSync(`${helper} deleteRegistry ${localRegName}`, cwd);
});

it('should send state message', async () => {
  const localDevice = 'test-rsa-device';
  const localRegName = `${registryName}-rsa256`;
  await execSync(`${helper} setupIotTopic ${topicName}`, cwd);
  await execSync(
    `${helper} createRegistry ${localRegName} ${topicName}`,
    cwd
  );
  await execSync(
    `${helper} createRsa256Device ${localDevice} ${localRegName} resources/rsa_cert.pem`,
    cwd
  );

  const output = await execSync(
    `${cmd} --messageType=state --numMessages=1 --privateKeyFile=resources/rsa_private.pem --algorithm=RS256`,
    cwd
  );
  assert.strictEqual(new RegExp(/Publishing message/).test(output), true);

  // Check / cleanup
  await execSync(
    `${helper} getDeviceState ${localDevice} ${localRegName}`,
    cwd
  );
  await execSync(
    `${helper} deleteDevice ${localDevice} ${localRegName}`,
    cwd
  );
  await execSync(`${helper} deleteRegistry ${localRegName}`, cwd);
});
