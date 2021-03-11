# Bridget

This repository contains the bridging functionality — aptly named Bridget — that will be used as a communication tool between the clients (usually web deliveries) & the Forward Publishing mobile app's webview implementation.

# Why a bridge
 If a client from our Forward Publishing suite requires a mobile app. We offer a native solution to their publishing platform, i.e the web delivery. 
 
 Although it mirrors the web delivery in content and simply displays it in a mobile friendly webview, some functionality needs to be communicated from the web world to the mobile native world. Linking or navigation in the web does not behave the same way in the mobile app, simply changing a URL in a webview will simply not do, as it destroys the native immersion and context of what's happenin within the app is lost. 

 That's where Bridget comes in; we can think of it as a thin communicational layer between the web delivery and the mobile app, where functionality in the app is being invoked by message passing from the bridge, and vice versa.
# Changeslog

See the [change log](./CHANGELOG.md)

# Installation

## Node version

The tool works with node 14.x so make sure you have that
installed first.
 On a Mac with [Homebrew](https://brew.sh) do:

```
brew install node@14
```

Otherwise see [the official guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


## Access to Github Package repostiory

Since this is a private org. package, you will need to have access to the registry it first in order to install it.

In your `~/.npmrc` (create it if you don't already  have it) file add the following line:

```
//npm.pkg.github.com/:_authToken=[github org. auth token goes here]
@forward-distribution:registry=https://npm.pkg.github.com
```

## Authenticating with Github

Follow this [section][github-access] to login into the registry with `npm`.

In esssence, you need to:

- obtain a personal or organization access token from GitHub
- use npm to log in
- And check how to get [github-access](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token)

Ask someone to give you the token when in doubt.

This needs to be done only once.

## Installing / upgrading the package itsef

Just run

```
npm install -g @forward-distribution/bridget
```

# Development

Requirements:

- node 14.x
- npm

Aftern they are installed run:

```

npm i

```

To setup up your local environment.

# Cutting a release

Cutting a release and publishing is easy, all you need to do is run:

```
npm run release
```

A few things to keep in mind which are happening in the background, `npm run release` calls this script:
```
standard-version && git push --follow-tags origin master
```

It uses [standard-version](https://github.com/conventional-changelog/standard-version) for versioning which under the hood uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to also auto generate changelogs for releases. So please stick to using the convention commits specification when creating commit messages, and the changelog will look neat and reflect the repo changes.

# API

> TODO