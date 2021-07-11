# Bridget

[![npm version](https://img.shields.io/npm/v/@forward-distribution/bridget?color=green&label=@forward-distribution/bridget)]()
[![GitHub Issues Open](https://img.shields.io/github/issues/forward-distribution/bridget)]()

This repository contains the bridging functionality — aptly named Bridget — that will be used as a communication tool between the clients (usually web deliveries) & the Forward Publishing mobile app's webview implementation.

# Why a bridge
 If a client from our Forward Publishing suite requires a mobile app, we offer a native solution to their publishing platform, i.e their web delivery. 
 
 Although it mirrors the web delivery 1:1 in terms of content and displays it in a mobile friendly webview, some functionality needs to be communicated from the web world to the mobile native world. Linking or navigation in the web does not behave the same way in the mobile app, simply changing a URL in a webview will not do, as it destroys the native immersion and context of what's happening within the app is lost. 

 That's where Bridget comes in; we can think of it as a thin communicational layer between the web delivery and the mobile app, where functionality in the app is being invoked by message passing (think of Android intents) from the bridge, and vice versa.

# [Integration Guide](#integration-guide)

Read our integration guide [here](./docs/integration.md). If any steps are unclear or something is missing, please [create a detailed issue](https://github.com/forward-distribution/bridget/issues/new).

# [Development](#development)

## Node version

The module works with node 14.x so make sure you have that
installed first.
 On a Mac with [Homebrew](https://brew.sh) do:

```sh
$ brew install node@14
```

Otherwise see [the official guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


**Requirements**:

- node 14.x
- npm

After they are installed run:

```
$ npm i
```

Your local environment should be set up now.

# Cutting a release

Cutting a release and publishing is easy, all you need to do is run:

```
$ npm run release
```

A few things to keep in mind which are happening in the background, `npm run release` calls this script:
```
$ standard-version && git push --follow-tags origin master
```

It uses [standard-version](https://github.com/conventional-changelog/standard-version) for versioning which under the hood uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to also auto generate changelogs for releases. So please stick to using the convention commits specification when creating commit messages, and the changelog will look neat and reflect the repo changes.

# Changelog

See the [change log](./CHANGELOG.md) for the latest release information.

