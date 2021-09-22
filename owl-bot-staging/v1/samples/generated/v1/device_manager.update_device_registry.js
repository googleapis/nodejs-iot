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

function main(deviceRegistry, updateMask) {
  // [START iot_update_device_registry_sample]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. The new values for the device registry. The `id` field must be empty, and
   *  the `name` field must indicate the path of the resource. For example,
   *  `projects/example-project/locations/us-central1/registries/my-registry`.
   */
  // const deviceRegistry = ''
  /**
   *  Required. Only updates the `device_registry` fields indicated by this mask.
   *  The field mask must not be empty, and it must not contain fields that
   *  are immutable or only set by the server.
   *  Mutable top-level fields: `event_notification_config`, `http_config`,
   *  `mqtt_config`, and `state_notification_config`.
   */
  // const updateMask = ''

  // Imports the Iot library
  const {DeviceManagerClient} = require('@google-cloud/iot').v1;

  // Instantiates a client
  const iotClient = new DeviceManagerClient();

  async function updateDeviceRegistry() {
    // Construct request
    const request = {
      deviceRegistry,
      updateMask,
    };

    // Run request
    const response = await iotClient.updateDeviceRegistry(request);
    console.log(response);
  }

  updateDeviceRegistry();
  // [END iot_update_device_registry_sample]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
