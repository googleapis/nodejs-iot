<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud IoT Core NodeJS Device Federated Authentication example

This sample app demonstrates the capabilites of Google Cloud IoT Core device federated authentication feature.

Devices authenticated to Cloud IoT Core can use the [Token Service](https://cloud.google.com/iot/alpha/docs/reference/cloudiottoken/rest) federated authentication to request [OAuth 2.0 access tokens](https://developers.google.com/identity/protocols/oauth2) in exchange for their [Cloud IoT Core JWTs](https://cloud.google.com/iot/docs/how-tos/credentials/jwts).

The OAuth 2.0 credentials can be used to call different [Google Cloud APIs](https://developers.google.com/identity/protocols/oauth2/scopes) with fine-grained permissions and access control using [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation).

For more information, see https://cloud.google.com/iot/alpha/docs/how-tos/federated_auth

# Setup

Run the following command to install the library dependencies for NodeJS:

    npm install

# Running the sample

    Commands:
      generateAccessToken                                 Generates OAuth 2.0 Google Access Token.
      exchangeDeviceAccessTokenToServiceAccountToken      Exchanges device access token to service account access token.
      publishPubSubMessage                                Publishes a message to Cloud Pub/Sub topic.
      downloadCloudStorageFile                            Downloads a file from Cloud Storage bucket.
      sendCommandToIoTDevice                              Sends a command to an IoT device.

    Examples:
      node access_token.js generateAccessToken us-central1 my-project my-registry my-device https://www.googleapis.com/auth/cloud-platform RS256 ../resources/rsa_private.pem
      node access_token.js publishPubSubMessage us-central1 my-project my-registry my-device RS256 ../resources/rsa_private.pem my-pubsub-topic
      node access_token.js downloadCloudStorageFile us-central1 my-project my-registry my-device RS256 ../resources/rsa_private.pem my-storage-bucket ../resources/logo.png
      node access_token.js sendCommandToIoTDevice us-central1 my-project my-registry my-device RS256 ../resources/rsa_private.pem my-service-account@my-project.iam.gserviceaccount.com
      node access_token.js exchangeDeviceAccessTokenToServiceAccountToken device-access-token my-service-account@my-project.iam.gserviceaccount.com

For more information, see https://cloud.google.com/iot-core/docs
