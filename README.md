# Bridget

This repository contains the bridging functionality — aptly named Bridget — that will be used as a communication tool between the clients (usually web deliveries) & the Forward Publishing mobile app's webview implementation.

# Why a bridge
 If a client from our Forward Publishing suite requires a mobile app, we offer a native solution to their publishing platform, i.e their web delivery. 
 
 Although it mirrors the web delivery 1:1 in terms of content and displays it in a mobile friendly webview, some functionality needs to be communicated from the web world to the mobile native world. Linking or navigation in the web does not behave the same way in the mobile app, simply changing a URL in a webview will not do, as it destroys the native immersion and context of what's happening within the app is lost. 

 That's where Bridget comes in; we can think of it as a thin communicational layer between the web delivery and the mobile app, where functionality in the app is being invoked by message passing (think of Android intents) from the bridge, and vice versa.

# [Integration Guide](#integration-guide)
The basis of this document is to explain the process of integrating `bridget` into an existing web delivery with the sole purpose of adding bridging support to the website when browsed through the context of a mobile app via a WebView.

## [Prerequisites](#prerequisites)
### Access to Github Package repostiory

> Only if you want to use the github package, instead of vanilla NPM

Since this is a private org. package, you will need to have access to the registry it first in order to install it.

In your `~/.npmrc` (create it if you don't already  have it) file add the following line:

```
//npm.pkg.github.com/:_authToken=[github org. auth token goes here]
@forward-distribution:registry=https://npm.pkg.github.com
```

### Authenticating with Github

Follow this section to login into the registry with `npm`.

In esssence, you need to:

- obtain a personal or organization access token from GitHub
- use npm to log in
- And check how to get [github-access](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token)

Ask someone to give you the token when in doubt.

This needs to be done only once.

## [Requirements](#requirements)

#TODO: write requirements that the web delivery needs to satisfy in order for the module to work

## [How to install](#how-to-install)
> The module is designed to run in the browser. It can be used in node as well, but the primary target is  for  the browser.

### [Installation via script tag](#install-via-script-tag)
```html
<script src="https://unpkg.com/@forward-distribution/bridget"></script>
<script type="text/javascript">
  // Initialize the module. Must be called before any other methods
  bridget.init();
</script>
```
Put the above script tags in between the <head> tags of your HTML page. It will attach a global `bridget` object. You can access it either via `bridget` or `window.bridget`.

## [Alternative installation via NPM](#alternative-installation-via-npm)
The module is available on NPM & as a github package which can be used if you’re using a front-end packager like Browserify or Webpack:

Just run

```
npm install -g @forward-distribution/bridget
```

You can then require the lib like a standard NPM module

## [How to use](#how-to-use)
### Reacting to user actions.
Actions are something that a user performed on your website such as “Clicked on a teaser”, "Navigated to a page/department", or “Attempted to share”.

In the context of your webpage, the browser itself or your custom JavaScript code handles these user events, and reacts to the accordingly. 

In the mobile context, however, these actions need to be propagated and offloaded from the browser (webview) and onto the app, to be handled natively. This is where you, as an integrator, will need to call bridget with the appropriate action (see [api reference](#api)).

As an example, handling a click event on the share action of an article.

```js
	onClickEvent = e => {
		e.preventDefault()
		e.stopPropagation()
		const { title, slug, description } = e.currentTarget.dataset
		if(window.ReactNativeWebView)
			bridge.shareArticle({url: slug, description: description, title: title})
		else 
			// do something else
	}
```

# [API](#api)

- todo 
- todo
- todo 

# [Development](#development)

## Node version

The module works with node 14.x so make sure you have that
installed first.
 On a Mac with [Homebrew](https://brew.sh) do:

```
brew install node@14
```

Otherwise see [the official guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


**Requirements**:

- node 14.x
- npm

After they are installed run:

```
npm i
```

Your local environment should be set up now.

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

# Changelog

See the [change log](./CHANGELOG.md)

