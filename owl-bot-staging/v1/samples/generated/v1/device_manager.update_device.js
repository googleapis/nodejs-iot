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

function main(device, updateMask) {
  // [START cloudiot_v1_generated_DeviceManager_UpdateDevice_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. The new values for the device. The `id` and `num_id` fields must
   *  be empty, and the field `name` must specify the name path. For example,
   *  `projects/p0/locations/us-central1/registries/registry0/devices/device0`or
   *  `projects/p0/locations/us-central1/registries/registry0/devices/{num_id}`.
   */
  // const device = {}
  /**
   *  Required. Only updates the `device` fields indicated by this mask.
   *  The field mask must not be empty, and it must not contain fields that
   *  are immutable or only set by the server.
   *  Mutable top-level fields: `credentials`, `blocked`, and `metadata`
   */
  // const updateMask = {}

  // Imports the Iot library
  const {DeviceManagerClient} = require('@google-cloud/iot').v1;

  // Instantiates a client
  const iotClient = new DeviceManagerClient();

  async function callUpdateDevice() {
    // Construct request
    const request = {
      device,
      updateMask,
    };

    // Run request
    const response = await iotClient.updateDevice(request);
    console.log(response);
  }

  callUpdateDevice();
  // [END cloudiot_v1_generated_DeviceManager_UpdateDevice_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
