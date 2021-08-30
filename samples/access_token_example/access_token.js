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
const {readFileSync} = require('fs');
const jwt = require('jsonwebtoken');
const {request} = require('gaxios');
const HOST = 'https://cloudiottoken.googleapis.com';
// Generate GCP access token."
const generateGcpToken = async (
  cloud_region,
  project_id,
  registry_id,
  device_id,
  scope,
  algorithm,
  certificate_file
) => {
  // [START iot_generate_gcp_token]
  // project_id = 'YOUR_PROJECT_ID'
  // cloud_region = 'us-central1'
  // registry_id = 'your-registry-id'
  // device_id = 'your-device-id'
  // scope = 'scope1 scope2' https://developers.google.com/identity/protocols/oauth2/scopes
  // algorithm = 'RS256'
  // certificate_file = 'path/to/certificate.pem'
  async function generateIotJwtToken(projectId, algorithm, certificateFile) {
    const jwtPayload = {
      iat: parseInt(Date.now() / 1000),
      exp: parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
      aud: projectId,
    };
    const privateKey = readFileSync(certificateFile);

    const encodedJwt = jwt.sign(jwtPayload, privateKey, {algorithm: algorithm});
    return encodedJwt;
  }
  async function exchangeIotJwtTokenWithGcpToken(
    cloudRegion,
    projectId,
    registryId,
    deviceId,
    jwtToken,
    scopes
  ) {
    const resoureUrl = `projects/${projectId}/locations/${cloudRegion}/registries/${registryId}/devices/${deviceId}`;
    const requestUrl = `${HOST}/v1beta1/${resoureUrl}:generateAccessToken`;

    const headers = {authorization: `Bearer ${jwtToken}`};

    const options = {
      url: requestUrl,
      method: 'POST',
      headers: headers,
      data: {
        device: resoureUrl,
        scope: scopes,
      },
      'content-type': 'application/json',
      'cache-control': 'no-cache',
    };
    try {
      const response = await request(options);
      return response.data;
    } catch (err) {
      console.error('Received error: ', err);
    }
  }
  const jwtToken = await generateIotJwtToken(
    project_id,
    algorithm,
    certificate_file
  );
  const gcpToken = await exchangeIotJwtTokenWithGcpToken(
    cloud_region,
    project_id,
    registry_id,
    device_id,
    jwtToken,
    scope
  );
  console.log(`Token generated: `, gcpToken);
  return gcpToken;
  // [END iot_generate_gcp_token]
};
exports.generateGcpToken = generateGcpToken;
