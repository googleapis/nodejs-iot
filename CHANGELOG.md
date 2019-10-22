# Changelog

## [1.3.0](https://www.github.com/googleapis/nodejs-iot/compare/v1.2.0...v1.3.0) (2019-10-22)


### Features

* .d.ts for protos ([653713e](https://www.github.com/googleapis/nodejs-iot/commit/653713e2694a82db67a0bf2c810a70d761b65e29))
* .d.ts for protos ([#207](https://www.github.com/googleapis/nodejs-iot/issues/207)) ([6bf34f4](https://www.github.com/googleapis/nodejs-iot/commit/6bf34f4445c7624235e0b83c3ef4423168467b89))


### Bug Fixes

* changes to retry logic ([68a1d6e](https://www.github.com/googleapis/nodejs-iot/commit/68a1d6ecb61c6c1af74e3890e7eee302d01db370))
* use compatible version of google-gax ([b3a96bb](https://www.github.com/googleapis/nodejs-iot/commit/b3a96bb6afd654844e52953b2409fcc3f48148f5))
* **deps:** bump google-gax to 1.7.5 ([#217](https://www.github.com/googleapis/nodejs-iot/issues/217)) ([7a6442e](https://www.github.com/googleapis/nodejs-iot/commit/7a6442ee0f8959ff10a9a8d646bb10e1c042c135))

## [1.2.0](https://www.github.com/googleapis/nodejs-iot/compare/v1.1.3...v1.2.0) (2019-09-16)


### Bug Fixes

* use correct version # for x-goog-api-client header ([09adf73](https://www.github.com/googleapis/nodejs-iot/commit/09adf73))


### Features

* load protos from JSON, grpc-fallback support ([5028ead](https://www.github.com/googleapis/nodejs-iot/commit/5028ead))

### [1.1.3](https://www.github.com/googleapis/nodejs-iot/compare/v1.1.2...v1.1.3) (2019-08-02)


### Bug Fixes

* allow calls with no request, add JSON proto ([9449e5a](https://www.github.com/googleapis/nodejs-iot/commit/9449e5a))

### [1.1.2](https://www.github.com/googleapis/nodejs-iot/compare/v1.1.1...v1.1.2) (2019-06-27)


### Bug Fixes

* **docs:** link to reference docs section on googleapis.dev ([#179](https://www.github.com/googleapis/nodejs-iot/issues/179)) ([ce86dba](https://www.github.com/googleapis/nodejs-iot/commit/ce86dba))

### [1.1.1](https://www.github.com/googleapis/nodejs-iot/compare/v1.1.0...v1.1.1) (2019-06-14)


### Bug Fixes

* **docs:** move to new client docs URL ([#174](https://www.github.com/googleapis/nodejs-iot/issues/174)) ([281face](https://www.github.com/googleapis/nodejs-iot/commit/281face))

## [1.1.0](https://www.github.com/googleapis/nodejs-iot/compare/v1.0.0...v1.1.0) (2019-06-06)


### Features

* support apiEndpoint override in client constructor ([#171](https://www.github.com/googleapis/nodejs-iot/issues/171)) ([551751e](https://www.github.com/googleapis/nodejs-iot/commit/551751e))

## [1.0.0](https://www.github.com/googleapis/nodejs-iot/compare/v0.2.1...v1.0.0) (2019-05-20)


### ⚠ BREAKING CHANGES

* upgrade engines field to >=8.10.0 (#144)

### Bug Fixes

* **deps:** update dependency google-gax to ^0.26.0 ([#142](https://www.github.com/googleapis/nodejs-iot/issues/142)) ([e329c68](https://www.github.com/googleapis/nodejs-iot/commit/e329c68))
* DEADLINE_EXCEEDED is no longer retried ([#152](https://www.github.com/googleapis/nodejs-iot/issues/152)) ([d037e51](https://www.github.com/googleapis/nodejs-iot/commit/d037e51))
* DEADLINE_EXCEEDED retry code is idempotent ([#155](https://www.github.com/googleapis/nodejs-iot/issues/155)) ([9e177ed](https://www.github.com/googleapis/nodejs-iot/commit/9e177ed))
* **deps:** update dependency google-gax to v1 ([#154](https://www.github.com/googleapis/nodejs-iot/issues/154)) ([ea2d803](https://www.github.com/googleapis/nodejs-iot/commit/ea2d803))


### Build System

* upgrade engines field to >=8.10.0 ([#144](https://www.github.com/googleapis/nodejs-iot/issues/144)) ([320fb70](https://www.github.com/googleapis/nodejs-iot/commit/320fb70))

## v0.2.1

03-13-2019 14:59 PDT

### Bug Fixes
- fix: throw on invalid credentials ([#119](https://github.com/googleapis/nodejs-iot/pull/119))

### Dependencies
- fix(deps): update dependency google-gax to ^0.25.0 ([#110](https://github.com/googleapis/nodejs-iot/pull/110))

### Documentation
- docs: update links in contrib guide ([#121](https://github.com/googleapis/nodejs-iot/pull/121))
- docs: update contributing path in README ([#116](https://github.com/googleapis/nodejs-iot/pull/116))
- docs: move CONTRIBUTING.md to root ([#115](https://github.com/googleapis/nodejs-iot/pull/115))
- docs: add lint/fix example to contributing guide ([#112](https://github.com/googleapis/nodejs-iot/pull/112))

### Internal / Testing Changes
- chore: update require statement code style
- build: Add docuploader credentials to node publish jobs ([#126](https://github.com/googleapis/nodejs-iot/pull/126))
- build: use node10 to run samples-test, system-test etc ([#125](https://github.com/googleapis/nodejs-iot/pull/125))
- build: update release configuration
- chore: update proto docs and code style
- chore(deps): update dependency mocha to v6
- build: use linkinator for docs test ([#120](https://github.com/googleapis/nodejs-iot/pull/120))
- build: create docs test npm scripts ([#118](https://github.com/googleapis/nodejs-iot/pull/118))
- build: test using @grpc/grpc-js in CI ([#117](https://github.com/googleapis/nodejs-iot/pull/117))
- refactor: improve generated code style. ([#114](https://github.com/googleapis/nodejs-iot/pull/114))
- chore(deps): update dependency eslint-config-prettier to v4 ([#109](https://github.com/googleapis/nodejs-iot/pull/109))
- build: ignore googleapis.com in doc link check ([#107](https://github.com/googleapis/nodejs-iot/pull/107))
- chore: update year in the license headers. ([#106](https://github.com/googleapis/nodejs-iot/pull/106))
- build: check broken links in generated docs ([#101](https://github.com/googleapis/nodejs-iot/pull/101))

## v0.2.0

01-14-2019 14:30 PST

### New Features
- feat: add enhanced gateway features ([#80](https://github.com/googleapis/nodejs-iot/pull/80))

### Dependencies
- chore(deps): update dependency through2 to v3 ([#69](https://github.com/googleapis/nodejs-iot/pull/69))
- fix(deps): update dependency google-gax to ^0.23.0 ([#103](https://github.com/googleapis/nodejs-iot/pull/103))

### Documentation
- fix(docs): remove unused IAM message types
- samples: update quickstart sample and add sample tests ([#98](https://github.com/googleapis/nodejs-iot/pull/98))
- docs: update readme badges ([#83](https://github.com/googleapis/nodejs-iot/pull/83))

### Internal / Testing Changes
- chore(build): inject yoshi automation key ([#97](https://github.com/googleapis/nodejs-iot/pull/97))
- chore: update nyc and eslint configs ([#96](https://github.com/googleapis/nodejs-iot/pull/96))
- chore: fix publish.sh permission +x ([#94](https://github.com/googleapis/nodejs-iot/pull/94))
- fix(build): fix Kokoro release script ([#93](https://github.com/googleapis/nodejs-iot/pull/93))
- build: add Kokoro configs for autorelease ([#92](https://github.com/googleapis/nodejs-iot/pull/92))
- chore: always nyc report before calling codecov ([#88](https://github.com/googleapis/nodejs-iot/pull/88))
- chore: nyc ignore build/test by default ([#87](https://github.com/googleapis/nodejs-iot/pull/87))
- chore: update license file ([#85](https://github.com/googleapis/nodejs-iot/pull/85))
- fix(build): fix system key decryption ([#81](https://github.com/googleapis/nodejs-iot/pull/81))
- chore: add a synth.metadata
- chore: update eslintignore config ([#74](https://github.com/googleapis/nodejs-iot/pull/74))
- chore(deps): update dependency @google-cloud/nodejs-repo-tools to v3 ([#73](https://github.com/googleapis/nodejs-iot/pull/73))
- chore: remove unused deps ([#71](https://github.com/googleapis/nodejs-iot/pull/71))
- chore: drop contributors from multiple places ([#72](https://github.com/googleapis/nodejs-iot/pull/72))
- chore: use latest npm on Windows ([#70](https://github.com/googleapis/nodejs-iot/pull/70))
- chore: update CircleCI config ([#68](https://github.com/googleapis/nodejs-iot/pull/68))
- chore: include build in eslintignore ([#65](https://github.com/googleapis/nodejs-iot/pull/65))
- chore(deps): update dependency eslint-plugin-node to v8 ([#61](https://github.com/googleapis/nodejs-iot/pull/61))
- chore: update issue templates ([#60](https://github.com/googleapis/nodejs-iot/pull/60))
- chore: remove old issue template ([#58](https://github.com/googleapis/nodejs-iot/pull/58))
- build: run tests on node11 ([#57](https://github.com/googleapis/nodejs-iot/pull/57))
- chores(build): do not collect sponge.xml from windows builds ([#56](https://github.com/googleapis/nodejs-iot/pull/56))
- chores(build): run codecov on continuous builds ([#55](https://github.com/googleapis/nodejs-iot/pull/55))
- chore: update new issue template ([#54](https://github.com/googleapis/nodejs-iot/pull/54))
- build: fix codecov uploading on Kokoro ([#51](https://github.com/googleapis/nodejs-iot/pull/51))
- Update kokoro config ([#49](https://github.com/googleapis/nodejs-iot/pull/49))
- chore(deps): update dependency eslint-plugin-prettier to v3 ([#48](https://github.com/googleapis/nodejs-iot/pull/48))
- build: prevent system/sample-test from leaking credentials
- Update the kokoro config ([#45](https://github.com/googleapis/nodejs-iot/pull/45))
- test: remove appveyor config ([#44](https://github.com/googleapis/nodejs-iot/pull/44))
- Update the CI config ([#43](https://github.com/googleapis/nodejs-iot/pull/43))
- Enable prefer-const in the eslint config ([#41](https://github.com/googleapis/nodejs-iot/pull/41))
- Enable no-var in eslint ([#40](https://github.com/googleapis/nodejs-iot/pull/40))
- Switch to let/const ([#39](https://github.com/googleapis/nodejs-iot/pull/39))
- Update CI config ([#37](https://github.com/googleapis/nodejs-iot/pull/37))
- Retry npm install in CI ([#35](https://github.com/googleapis/nodejs-iot/pull/35))
- Update CI config ([#32](https://github.com/googleapis/nodejs-iot/pull/32))
- Re-generate library using /synth.py ([#31](https://github.com/googleapis/nodejs-iot/pull/31))
- chore(deps): update dependency nyc to v13 ([#30](https://github.com/googleapis/nodejs-iot/pull/30))
- chore(deps): update dependency eslint-config-prettier to v3 ([#26](https://github.com/googleapis/nodejs-iot/pull/26))
- chore: do not use npm ci ([#25](https://github.com/googleapis/nodejs-iot/pull/25))
- chore: ignore package-lock.json ([#24](https://github.com/googleapis/nodejs-iot/pull/24))
- chore(deps): lock file maintenance ([#23](https://github.com/googleapis/nodejs-iot/pull/23))
- chore(deps): lock file maintenance ([#22](https://github.com/googleapis/nodejs-iot/pull/22))
- chore: update renovate config ([#21](https://github.com/googleapis/nodejs-iot/pull/21))
- test: throw on deprecation ([#20](https://github.com/googleapis/nodejs-iot/pull/20))
- chore(deps): lock file maintenance ([#18](https://github.com/googleapis/nodejs-iot/pull/18))
- chore: move mocha options to mocha.opts ([#16](https://github.com/googleapis/nodejs-iot/pull/16))
- chore: require node 8 for samples ([#17](https://github.com/googleapis/nodejs-iot/pull/17))

## v0.1.1

### Dependencies
- chore(deps): update dependency eslint-plugin-node to v7 (#8)

### Documentation
- doc: fix product name, etc.. in README.md (#14)
- Add missing JSDoc namespaces. (#9)

### Internal / Testing Changes
- chore(build): use .circleci/config.yml from synth tool template (#11)
- test: use strictEqual in tests (#6)
- chore: Configure Renovate (#7)

## v0.1.0

- Initial release of @google-cloud/iot
