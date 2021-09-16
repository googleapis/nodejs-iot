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

const {readFileSync} = require('fs');
const jwt = require('jsonwebtoken');

const createJwt = (projectId, privateKeyFile, algorithm) => {
  // [START iot_create_jwt]
  // projectId = 'YOUR_PROJECT_ID'
  // privateKeyFile = 'path/to/private_key.pem'
  // algorithm = 'RS256'
  const jwtPayload = {
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
    aud: projectId,
  };
  const privateKey = readFileSync(privateKeyFile);
  return jwt.sign(jwtPayload, privateKey, {algorithm: algorithm});
  // [END iot_create_jwt]
};

module.exports = {createJwt};
