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
const { request } = require('gaxios');
const { generateGcpToken } = require('../access_token');
const { readFileSync } = require('fs');
const iot = require('@google-cloud/iot');
const {PubSub} = require('@google-cloud/pubsub');
const uuid = require('uuid');
const { after, before, it } = require('mocha');

const deviceId = 'test-node-device';
const topicName = `nodejs-docs-samples-test-iot-${uuid.v4()}`;
const testTopicName = `nodejs-docs-samples-test-pubsub-iot-${uuid.v4()}`;
const registryName = `nodejs-test-registry-iot-${uuid.v4()}`;
const bucketName = `nodejs-test-bucket-iot-${uuid.v4()}`;
const region = 'us-central1';
const projectId =
  process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
const rsaPublicCert = '../../resources/rsa_cert.pem'; // process.env.NODEJS_IOT_RSA_PUBLIC_CERT;
const rsaPrivateKey = '../../resources/rsa_private.pem'; //process.env.NODEJS_IOT_RSA_PRIVATE_KEY;
const iotClient = new iot.v1.DeviceManagerClient();
const pubSubClient = new PubSub({ projectId });

before(async () => {
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

  await createDevice();
  console.log(`Created Device: ${deviceId}`);
});

after(async () => {
  // delete pubsub topic
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

  const registryPath = iotClient.registryPath(projectId, region, registryName);
  await iotClient.deleteDeviceRegistry({
    name: registryPath,
  });
  console.log('Deleted test registry.');
});

it('Generate gcp access token, use gcp access token to create gcs bucket upload a file to bucket, download file from bucket', async () => {
  const scope = 'https://www.googleapis.com/auth/devstorage.full_control';
  // generate access token
  const access_token = await generateGcpToken(
    region,
    projectId,
    registryName,
    deviceId,
    scope,
    'RS256',
    rsaPrivateKey
  );
  const headers = { authorization: `Bearer ${access_token}` };
  // Create GCS bucket
  const createGcsPayload = {
    name: bucketName,
    location: region,
    storageClass: "STANDARD",
    iamConfiguration: {
      uniformBucketLevelAccess: { enabled: true },
    },
  };

  const createGcsRequestUrl = `https://storage.googleapis.com/storage/v1/b?project=${projectId}`
  const createGcsOptions = {
    url: createGcsRequestUrl,
    method: 'POST',
    headers: headers,
    data: Buffer.from(JSON.stringify(createGcsPayload)),
    'content-type': 'application/json',
    'cache-control': 'no-cache',
  };
  const createResponse = await request(createGcsOptions);
  assert.strictEqual(createResponse.status, 200);

  // Upload Data to GCS bucket
  const dataName = 'testFILE';
  const binaryData = readFileSync('../../../resources/logo.png');
  const uploadGcsRequestUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${dataName}`;
  const uploadGcsOptions = {
    url: uploadGcsRequestUrl,
    method: 'POST',
    headers: headers,
    data: binaryData,
    'content-type': 'image/png',
    'cache-control': 'no-cache',
  };
  const uploadResponse = await request(uploadGcsOptions);
  assert.strictEqual(uploadResponse.status, 200);

  // Download Data from GCS bucket
  const downloadGcsRequestUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${dataName}?alt=media`;
  const downloadGcsOptions = {
    url: downloadGcsRequestUrl,
    method: 'GET',
    headers: headers,
    'cache-control': 'no-cache',
  };
  const downloadResponse = await request(downloadGcsOptions);
  assert.strictEqual(downloadResponse.status, 200);

  // Delete Data from GCS Bucket.
  const deleteGcsRequestUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${dataName}`;
  const deleteGcsOptions = {
    url: doeleteGcsRequestUrl,
    method: 'DELETE',
    headers: headers,
    'cache-control': 'no-cache',
  };
  const deleteResponse = await request(deleteGcsOptions);
  assert.strictEqual(deleteResponse.status, 200);

  // Delete GCS bucket
  const deleteGcsRequestUrl = `https://storage.googleapis.com/storage/v1/b/${createResponse.data?.name}`;
  const deleteResp = req.delete(url = deleteGcsRequestUrl, headers = headers)
  assert.strictEqual(deleteResp.status, 200);

});

it('Generate gcp access token, use gcp access token to create pubsub topic, push message to pubsub', async () => {
  const scope = 'https://www.googleapis.com/auth/pubsub';
  // generate access token
  const access_token = await generateGcpToken(
    region,
    projectId,
    registryName,
    deviceId,
    scope,
    'RS256',
    rsaPrivateKey
  );

  const headers = { authorization: `Bearer ${access_token}` };
  // Create pubsub topic
  const createPubsubRequestUrl = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${testTopicName}`;
  const createPubsubOptions = {
    url: createPubsubRequestUrl,
    method: 'PUT',
    headers: headers,
    data: {},
    'content-type': 'application/json',
    'cache-control': 'no-cache',
  };
  const createResponse = await request(createPubsubOptions);
  assert.strictEqual(createResponse.status, 200);

  // Publish message to pubsub topic
  const publishPayload = {
    messages: [
      {
        attributes: {
          test: "VALUE"
        },
        data: Buffer.from("MESSAGE_DATA", 'base64').toString('utf-8'),
      }
    ]
  };
  const publishPubsubRequestUrl = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${testTopicName}:publish`;
  const publishPubsubOptions = {
    url: publishPubsubRequestUrl,
    method: 'POST',
    headers: headers,
    data: publishPayload,
    'content-type': 'application/json',
    'cache-control': 'no-cache',
  };
  const publishResponse = await request(publishPubsubOptions);
  assert.strictEqual(publishResponse.status, 200);

  // Delete pubsub topic
  const deletePubsubRequestPath = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${testTopicName}`;
  const deletePubsubOptions = {
    url: deletePubsubRequestPath,
    method: 'DELETE',
    headers: headers,
    'content-type': 'application/json',
    'cache-control': 'no-cache',
  };
  const deleteResponse = await request(deletePubsubOptions);
  assert.strictEqual(deleteResponse.status, 200);
});
