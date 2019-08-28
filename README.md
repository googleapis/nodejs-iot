[//]: # "This README.md file is auto-generated, all changes to this file will be lost."
[//]: # "To regenerate it, use `python -m synthtool`."
<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# [Google Cloud Internet of Things (IoT) Core: Node.js Client](https://github.com/googleapis/nodejs-iot)

[![release level](https://img.shields.io/badge/release%20level-alpha-orange.svg?style=flat)](https://cloud.google.com/terms/launch-stages)
[![npm version](https://img.shields.io/npm/v/@google-cloud/iot.svg)](https://www.npmjs.org/package/@google-cloud/iot)
[![codecov](https://img.shields.io/codecov/c/github/googleapis/nodejs-iot/master.svg?style=flat)](https://codecov.io/gh/googleapis/nodejs-iot)




> Node.js idiomatic client for [Cloud IoT Core][product-docs].

[Google Cloud Internet of Things (IoT) Core](https://cloud.google.com/iot/docs) is a fully managed service for securely connecting and managing IoT devices, from a few to millions. Ingest data from connected devices and build rich applications that integrate with the other big data services of Google Cloud Platform.


* [Google Cloud Internet of Things (IoT) Core Node.js Client API Reference][client-docs]
* [Google Cloud Internet of Things (IoT) Core Documentation][product-docs]
* [github.com/googleapis/nodejs-iot](https://github.com/googleapis/nodejs-iot)

Read more about the client libraries for Cloud APIs, including the older
Google APIs Client Libraries, in [Client Libraries Explained][explained].

[explained]: https://cloud.google.com/apis/docs/client-libraries-explained

**Table of contents:**


* [Quickstart](#quickstart)
  * [Before you begin](#before-you-begin)
  * [Installing the client library](#installing-the-client-library)
  * [Using the client library](#using-the-client-library)
* [Samples](#samples)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

## Quickstart

### Before you begin

1.  [Select or create a Cloud Platform project][projects].
1.  [Enable billing for your project][billing].
1.  [Enable the Google Cloud Internet of Things (IoT) Core API][enable_api].
1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

### Installing the client library

```bash
npm install @google-cloud/iot
```


### Using the client library

```javascript
  const iot = require('@google-cloud/iot');
  const client = new iot.v1.DeviceManagerClient();

  async function quickstart() {
    const projectId = await client.getProjectId();
    const parent = client.locationPath(projectId, 'us-central1');
    const [resources] = await client.listDeviceRegistries({parent});
    console.log(`${resources.length} resource(s) found.`);
    for (const resource of resources) {
      console.log(resource);
    }
  }
  quickstart();

```



## Samples

Samples are in the [`samples/`](https://github.com/googleapis/nodejs-iot/tree/master/samples) directory. The samples' `README.md`
has instructions for running the samples.

| Sample                      | Source Code                       | Try it |
| --------------------------- | --------------------------------- | ------ |
| Quickstart | [source code](https://github.com/googleapis/nodejs-iot/blob/master/samples/quickstart.js) | [![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-iot&page=editor&open_in_editor=samples/quickstart.js,samples/README.md) |



The [Google Cloud Internet of Things (IoT) Core Node.js Client API Reference][client-docs] documentation
also contains samples.

## Versioning

This library follows [Semantic Versioning](http://semver.org/).




This library is considered to be in **alpha**. This means it is still a
work-in-progress and under active development. Any release is subject to
backwards-incompatible changes at any time.



More Information: [Google Cloud Platform Launch Stages][launch_stages]

[launch_stages]: https://cloud.google.com/terms/launch-stages

## Contributing

Contributions welcome! See the [Contributing Guide](https://github.com/googleapis/nodejs-iot/blob/master/CONTRIBUTING.md).

## License

Apache Version 2.0

See [LICENSE](https://github.com/googleapis/nodejs-iot/blob/master/LICENSE)

[client-docs]: https://googleapis.dev/nodejs/iot/latest
[product-docs]: https://cloud.google.com/iot
[shell_img]: https://gstatic.com/cloudssh/images/open-btn.png
[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing
[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=cloudiot.googleapis.com
[auth]: https://cloud.google.com/docs/authentication/getting-started
