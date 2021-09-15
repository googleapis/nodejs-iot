const {
  publishPubSubMessage,
  exchangeDeviceAccessTokenToServiceAccountToken,
  downloadCloudStorageFile,
  sendCommandToIoTDevice,
} = require('./access_token');

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
