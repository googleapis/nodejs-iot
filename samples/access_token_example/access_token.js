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
const jwt = require('jsonwebtoken');
const { request } = require('gaxios');

const createJwt = (projectId, privateKeyFile, algorithm) => {
  const jwtPayload = {
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
    aud: projectId,
  };
  const privateKey = readFileSync(privateKeyFile);
  return jwt.sign(jwtPayload, privateKey, { algorithm: algorithm });
};

// Generate device access token
const generateAccessToken = async (
  cloudRegion,
  projectId,
  registryId,
  deviceId,
  scope,
  algorithm,
  privateKeyFile
) => {
  // [START iot_generate_access_token]
  // cloudRegion = 'us-central1'
  // projectId = 'YOUR_PROJECT_ID'
  // registryId = 'your-registry-id'
  // deviceId = 'your-device-id'
  // scope = 'scope1 scope2' // See the full list of scopes \
  //     at: https://developers.google.com/identity/protocols/oauth2/scopes
  // algorithm = 'RS256'
  // privateKeyFile = 'path/to/private_key.pem'

  async function generateDeviceAccessToken(
    cloudRegion,
    projectId,
    registryId,
    deviceId,
    jwtToken,
    scope
  ) {
    const resourcePath = `projects/${projectId}/locations/${cloudRegion}/registries/${registryId}/devices/${deviceId}`;
    const requestUrl = `https://cloudiottoken.googleapis.com/v1beta1/${resourcePath}:generateAccessToken`;

    const headers = { authorization: `Bearer ${jwtToken}` };

    const options = {
      url: requestUrl,
      method: 'POST',
      headers: headers,
      data: {
        device: resourcePath,
        scope: scope,
      },
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    try {
      const response = await request(options);
      return response.data['access_token'];
    } catch (err) {
      console.error('Received error: ', err);
    }
  }

  // Generate IoT device JWT. See https://cloud.google.com/iot/docs/how-tos/credentials/jwts
  const jwtToken = createJwt(projectId, privateKeyFile, algorithm);

  const accessToken = await generateDeviceAccessToken(
    cloudRegion,
    projectId,
    registryId,
    deviceId,
    jwtToken,
    scope
  );
  return accessToken;
  // [END iot_generate_access_token]
};

const publishPubSubMessage = async (
  cloudRegion,
  projectId,
  registryId,
  deviceId,
  algorithm,
  privateKeyFile,
  topicId
) => {
  // [START iot_access_token_pubsub]
  // cloudRegion = 'us-central1'
  // projectId = 'YOUR_PROJECT_ID'
  // registryId = 'your-registry-id'
  // deviceId = 'your-device-id'
  // algorithm = 'RS256'
  // privateKeyFile = 'path/to/private_key.pem'
  // topicId = 'pubsub-topic-id'

  const scope = 'https://www.googleapis.com/auth/pubsub';
  // Generate device access token
  const access_token = await generateAccessToken(
    cloudRegion,
    projectId,
    registryId,
    deviceId,
    scope,
    algorithm,
    privateKeyFile
  );

  const headers = { authorization: `Bearer ${access_token}` };
  try {
    // Create Pub/Sub topic
    const createPubsubRequestUrl = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topicId}`;
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

    // Publish message to Pub/Sub topic
    const publishPayload = {
      messages: [
        {
          attributes: {
            test: 'VALUE',
          },
          data: Buffer.from('MESSAGE_DATA').toString('base64'),
        },
      ],
    };
    const publishPubsubRequestUrl = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topicId}:publish`;
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

    // Delete Pub/Sub topic
    const deletePubsubRequestPath = `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topicId}`;
    const deletePubsubOptions = {
      url: deletePubsubRequestPath,
      method: 'DELETE',
      headers: headers,
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    const deleteResponse = await request(deletePubsubOptions);
    assert.strictEqual(deleteResponse.status, 200);
  } catch (error) {
    console.log('Error received: ', JSON.stringify(error));
  }
  // [END iot_access_token_pubsub]
};

const downloadCloudStorageFile = async (
  cloudRegion,
  projectId,
  registryId,
  deviceId,
  algorithm,
  privateKeyFile,
  bucketName,
  dataPath
) => {
  // [START iot_access_token_gcs]
  // cloudRegion = 'us-central1'
  // projectId = 'YOUR_PROJECT_ID'
  // registryId = 'your-registry-id'
  // deviceId = 'your-device-id'
  // algorithm = 'RS256'
  // privateKeyFile = 'path/to/private_key.pem'
  // bucketName = 'name-of-gcs-bucket'
  // dataPath = 'path/to/file/to/be/uploaded.png'
  const scope = 'https://www.googleapis.com/auth/devstorage.full_control';
  // Generate device access token
  const access_token = await generateAccessToken(
    cloudRegion,
    projectId,
    registryId,
    deviceId,
    scope,
    algorithm,
    privateKeyFile
  );

  const headers = { authorization: `Bearer ${access_token}` };
  try {
    // Create GCS bucket
    const createGcsPayload = {
      name: bucketName,
      location: cloudRegion,
      storageClass: 'STANDARD',
      iamConfiguration: {
        uniformBucketLevelAccess: { enabled: true },
      },
    };

    const createGcsRequestUrl = `https://storage.googleapis.com/storage/v1/b?project=${projectId}`;
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
    const binaryData = readFileSync(dataPath);
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
    const deleteDataGcsRequestUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o/${dataName}`;
    const deleteDataGcsOptions = {
      url: deleteDataGcsRequestUrl,
      method: 'DELETE',
      headers: headers,
      'cache-control': 'no-cache',
    };
    const deleteDataResponse = await request(deleteDataGcsOptions);
    assert.strictEqual(deleteDataResponse.status, 204);

    // Delete GCS bucket
    const deleteGcsRequestUrl = `https://storage.googleapis.com/storage/v1/b/${createResponse.data.name}`;
    const deleteGcsOptions = {
      url: deleteGcsRequestUrl,
      method: 'DELETE',
      headers: headers,
      'cache-control': 'no-cache',
    };
    const deleteResp = await request(deleteGcsOptions);
    assert.strictEqual(deleteResp.status, 204);
  } catch (error) {
    console.log('Error received: ', JSON.stringify(error));
  }
  // [END iot_access_token_gcs]
};

const exchangeDeviceAccessTokenToServiceAccountToken = async (
  deviceAccessToken,
  serviceAccountEmail
) => {
  // [START iot_access_token_service_account_token]
  // deviceAccessToken = 'device-access-token'
  // serviceAccountEmail  = 'your-service-account@your-project.iam.gserviceaccount.com'
  const scope = 'https://www.googleapis.com/auth/cloud-platform';
  const headers = { authorization: `Bearer ${deviceAccessToken}` };
  try {
    const exchangePayload = {
      scope: [scope],
    };
    const exchangeRequestUrl = `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`;
    const exchangeOptions = {
      url: exchangeRequestUrl,
      method: 'POST',
      headers: headers,
      data: JSON.stringify(exchangePayload),
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    const exchangeResponse = await request(exchangeOptions);
    assert.strictEqual(exchangeResponse.status, 200);
    assert.strictEqual(
      exchangeResponse.data && exchangeResponse.data.accessToken !== '',
      true
    );
    return exchangeResponse.data.accessToken;
  } catch (error) {
    console.log('Error received: ', JSON.stringify(error));
  }
  // [END iot_access_token_service_account_token]
};

const sendCommandToIoTDevice = async (
  cloudRegion,
  projectId,
  registryId,
  deviceId,
  algorithm,
  privateKeyFile,
  serviceAccountEmail,
  commandTobeSentToDevice
) => {
  // [START iot_access_token_iot_send_command]
  // cloudRegion = 'us-central1'
  // projectId = 'YOUR_PROJECT_ID'
  // registryId = 'your-registry-id'
  // deviceId = 'your-device-id'
  // algorithm = 'RS256'
  // privateKeyFile = 'path/to/private_key.pem'
  // serviceAccountEmail  = 'your-service-account@your-project.iam.gserviceaccount.com'
  // commandTobeSentToDevice = 'command-to-device'

  const scope = 'https://www.googleapis.com/auth/cloud-platform';
  // Generate device access token
  const access_token = await generateAccessToken(
    cloudRegion,
    projectId,
    registryId,
    deviceId,
    scope,
    algorithm,
    privateKeyFile
  );
  try {
    // Exchange GCP access token to a service account access token
    const serviceAccountAccessToken =
      await exchangeDeviceAccessTokenToServiceAccountToken(
        access_token,
        serviceAccountEmail
      );

    // Send command to IoT Device
    const commandPayload = {
      binaryData: Buffer.from(commandTobeSentToDevice).toString('base64'),
    };
    const commandRequesturl = `https://cloudiot.googleapis.com/v1/projects/${projectId}/locations/${cloudRegion}/registries/${registryId}/devices/${deviceId}:sendCommandToDevice`;
    const commandOptions = {
      url: commandRequesturl,
      method: 'POST',
      headers: { authorization: `Bearer ${serviceAccountAccessToken}` },
      data: JSON.stringify(commandPayload),
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    const commandResponse = await request(commandOptions);
    assert.strictEqual(commandResponse.status, 200);
  } catch (error) {
    console.log('Error received: ', JSON.stringify(error));
  }
  // [END iot_access_token_iot_send_command]
};

module.exports = {
  generateAccessToken,
  createJwt,
  exchangeDeviceAccessTokenToServiceAccountToken,
  downloadCloudStorageFile,
  publishPubSubMessage,
  sendCommandToIoTDevice,
};
require(`yargs`) // eslint-disable-line
  .demand(1)
  .options({
    cloudRegion: {
      alias: 'c',
      default: 'us-central1',
      requiresArg: true,
      type: 'string',
    },
    projectId: {
      alias: 'p',
      default: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
      description:
        'The Project ID to use. Defaults to the value of the GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT environment variables.',
      requiresArg: true,
      type: 'string',
    }
  })
  .command(
    'generateAccessToken <registryId> <deviceId> <scope> <algorithm> <privateKeyPath>',
    'Generate GCP Access Token.',
    {},
    async opts => {
      await generateAccessToken(
        opts.cloudRegion,
        opts.projectId,
        opts.registryId,
        opts.deviceId,
        opts.scope,
        opts.algorithm,
        opts.privateKeyPath
      );
    }
  )
  .command(
    'publishPubSubMessage <registryId> <deviceId> <algorithm> <privateKeyPath> <topicName>',
    'Publish message to pubsub.',
    {},
    async opts => {
      await publishPubSubMessage(
        opts.cloudRegion,
        opts.projectId,
        opts.registryId,
        opts.deviceId,
        opts.algorithm,
        opts.privateKeyPath,
        opts.topicName
      );
    }
  )
  .command(
    'downloadCloudStorageFile <registryId> <deviceId> <algorithm> <privateKeyPath> <bucketName> <dataPath>',
    'Download file from Cloud Storage.',
    {},
    async opts => {
      await downloadCloudStorageFile(
        opts.cloudRegion,
        opts.projectId,
        opts.registryId,
        opts.deviceId,
        opts.algorithm,
        opts.privateKeyPath,
        opts.bucketName,
        opts.dataPath
      );
    }
  )
  .command(
    'sendCommandToIoTDevice <registryId> <deviceId> <algorithm> <privateKeyPath> <serviceAccountEmail> <commandToBeSent>',
    'Send command to IoT Device.',
    {},
    async opts => {
      await sendCommandToIoTDevice(
        opts.cloudRegion,
        opts.projectId,
        opts.registryId,
        opts.deviceId,
        opts.algorithm,
        opts.privateKeyPath,
        opts.serviceAccountEmail,
        opts.commandToBeSent
      );
    }
  )
  .command(
    'exchangeDeviceAccessTokenToServiceAccountToken <deviceAccessToken> <serviceAccountEmail>',
    'Exchange Device Access Token for Service Account Token.',
    {},
    async opts => {
      await exchangeDeviceAccessTokenToServiceAccountToken(
        opts.deviceAccessToken,
        opts.serviceAccountEmail
      );
    }
  )
  .example(
    'node $0 generateAccessToken my-registry my-device https://www.googleapis.com/auth/devstorage.full_control  RS256 ./rsa_cert.pem'
  )
  .example('node $0 publishPubSubMessage us-central1 my-project my-registry my-device RS256 ../resources/rsa_private.pem my-pubsub-topic')
  .example('node $0 downloadCloudStorageFile us-central1 my-project my-registry my-device RS256 ../resources/rsa_private.pem my-storage-bucket ../resources/logo.png')
  .example('node $0 sendCommandToIoTDevice us-central1 my-project my-registry my-device RS256 ../resources/rsa_private.pem my-service-account@my-project.iam.gserviceaccount.com')
  .example('node $0 exchangeDeviceAccessTokenToServiceAccountToken device-access-token my-service-account@my-project.iam.gserviceaccount.com')
  .wrap(120)
  .recommendCommands()
  .epilogue('For more information, see https://cloud.google.com/iot-core/docs')
  .help()
  .strict().argv;
