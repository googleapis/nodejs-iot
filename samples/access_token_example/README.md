<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud IoT Core NodeJS Access token api example

This sample app demonstrates gcp access token generation for Google Cloud IoT.

# Setup

Run the following command to install the library dependencies for NodeJS:

    npm install

# Running the sample

    Commands:
      generateGcpAccessToken <registryId> <deviceId>' Generate GCP access token.

    Options:
      --projectId, -p       The Project ID to use. Defaults to the value of the GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT
                            environment variables.                                                                  [string]
      --registryId, -r      The Cloud Iot registry Id where the device belongs to.
                                                       [string]
      --deviceId, -d      The Cloud Iot device Id of the device.
                                                       [string]
      --scopes, -s      The scope of the generated gcp token. space delimited string.
                                                       [string]
      --algorithm, -a      The algorithm for the device certificate. Defaults to RS256
                                                       [string]
      --certificateFile, -ce      Path to the device private key.
                                                       [string]
      --help                Show help                                                                              [boolean]
      --cloudRegion, -c                                                                    [string] [default: "us-central1"]

    Examples:
      node access_token.js generateGcpAccessToken my-registry my-es-device
      -ce '../private_key.pem' -s 'scope1 scope2'

    For more information, see https://cloud.google.com/iot-core/docs
