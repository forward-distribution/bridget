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

In the API segment of the integration guide we will define all of the specific changes the delivery should support in order for it to be compatible to use within the WebView context.

## Introduction to hijacking `onClick` events

The basic idea of how we handle essential click events within the WebView is through hijacking the `onClick` events within the web delivery. What we mean by this is having `onClick` listeners that bridget uses to detect any dispatched events that are going on and to decide (internally) how they should be handled and which WebView actions should be posted back to the app and handled natively there. In other words, whenever something is clicked bridget is aware of this and uses the data properties supplied to the click component to figure out what should be done.

## Linking

The linking part of the API focuses on two things, article navigation and page navigation. Essentially, anywhere in the app where you have a link (the most typical example would be the `<a> ... </a>` tag)  bridget will hijack the `onClick` event of this component and do something else instead, provided the correct data properties have been set. If they are not set, nothing will happen.

Required data properties:

- `data-webview-path`

    - This property should contain the webview URL to which we want to navigate, typically either the article/page url which would be opened when clicking on the component
    - Article example: Given the url `https://www.mz.de/lokal/halle-saale/14-unfalle-am-freitag-vormittag-im-stadtgebiet-von-halle-3202186` we should set the data property to exactly this url
    - Page example: Given the url `https://www.mz.de/leben/haus-und-garten` we should set the data property to exactly this url
    
Example:

```js
	<a href="https://www.google.com">Open google for me !</a>
```

would become 

```js
	<a href="https://www.google.com" 
           data-webview-path="https://www.google.com">
            Open google for me !
        </a>
```

## Linking type resolution

In order for bridget to be able to differentiate when between links when handling them, there is a possibility to inject custom logic for linking purposes. A good example for this would be to think about how exactly we define an article ? Would it contain an article slug, an article ID, or perhaps something else we should look for ? 

This is done entirely through regex during the bridget initialization phase.

Parameters:

- `articleResolutionRegex`
    - This parameter should serve as a test against a url to check if the url leads to an article
    
- `pageResolutionRegex`
    - This parameter should serve as a test against a url to check if the url leads to a page
    
Please keep in mind that these two regexes should:

- Be disjunct; we don't want a specific url to both test true against `articleResolutionRegex` and `pageResolutionRegex`
- Cover all articles and pages within the web delivery - if both of these fail the url will be considered to be an external one

## Social links

This is something we should get for free, provided the web delivery using bridget supports the opening of the social applications from the browser. As of now, no additional handling here is required.

## Sharing

Sharing is triggered through bridget once again by hijacking an `onClick` event that has specific properties. Additionally, it should contain some sharing metadata which we would need.

Required data properties:

- `data-webview-share-url`
    - This data property refers to the share url that should be provided when sharing the document of the app somewhere
    - It should be an absolute path to the document we want to share
    
- `data-webview-share-title`
    - This property refers to the title that would go along with sharing the URL through the app
    - It should typically be the title of the document (article/page for example) we are trying to share
    
- `data-webview-share-description`
    - This property refers to the basic subtext that comes with sharing a document
    - It should typically be either a subtitle, a short abstract of the document or something similar
    
Example:

```js
    <div>
        <span>{articleTitle}</span>
        <span>{articleDescription}</span>
        <div>
          // ... the article content
        </div>
	<ShareButton onClick={() => this.share(shareUrl)}>
           Sharing
        <ShareButton/>
    </div>
```

would become

```js
    <div>
        <span>{articleTitle}</span>
        <span>{articleDescription}</span>
        <div>
          // ... the article content
        </div>
	<ShareButton 
          onClick={() => this.share(shareUrl)}
          data-webview-share-url={url}
          data-webview-share-title={articleTitle}
          data-webview-share-description={articleDescription}>
            Sharing
        <ShareButton/>
    </div>
```

## Hiding specific web components

This part of the API focuses on removing certain components that might appear in the delivery that should generally be handled natively. A few examples that come to mind would be the headers, specific footers or anything you can think of that your web delivery has that **should not appear** in the WebView.

Required data properties:

- `data-webview-hide`

    - Whenever this property appears on some html component bridget and is true will inject the CSS property `display: 'none'` to it, thus removing it from the viewport
    - The default value for this attribute is false (same as not adding it)

Example:

```js
	<NavigationHeader style={...} >
           <p>First item</p>
           <p>Second item</p>
           .
           .
           .
           <p>Last item</p>
        <NavigationHeader/>
```

would become

```js
	<NavigationHeader style={...} data-webview-hide="true">
           <p>First item</p>
           <p>Second item</p>
           .
           .
           .
           <p>Last item</p>
        <NavigationHeader/>
```
    


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

