# [For Developers](#developers)

## Node version

The module works with node 14.x so make sure you have that
installed.

> If you need to support multiple node versions on your workstation, you'll need a node version manager;  we like using [nvm](https://github.com/nvm-sh/nvm).

 On a Mac with [Homebrew](https://brew.sh) do:

```sh
$ brew install node@14
```

If using `nvm` do:
```sh
$ nvm install
```

Otherwise see [the official guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


**Requirements**:

- node 14.x
- npm

After those requirements are met run, go into the root of the project and run:

```sh
$ npm i
```

Your local environment should be set up now.

# Cutting a release

Cutting a release and publishing is easy, all you need to do is run:

```
$ npm run release
```

A few things to keep in mind which are happening in the background, `npm run release` calls this script:
```sh
$ standard-version && git push --follow-tags origin master
```

It uses [standard-version](https://github.com/conventional-changelog/standard-version) for versioning which under the hood uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to also auto generate changelogs for releases.

Please stick to using the conventional commits specification when creating commit messages, and the changelog will look neat and reflect the repo changes. See the [examples](https://www.conventionalcommits.org/en/v1.0.0/#examples) to see how to structure commits.

## [How it works](#how-it-works)
`bridget` has two main goals in, when integrated into a website, it needs to [react to user actions](#react-to-user-actions) and [customize website styling](#customize-website-styling).

### [React to user actions](#react-to-user-actions)
Actions are something that a user performed on a website such as “*Clicked on a teaser*”, "*Navigated to a page/department*", or “*Attempted to share*”.

In the context of a webpage, the browser itself or some custom JavaScript code handles these user events, and reacts to them accordingly. 

In the mobile context, however, these actions need to be propagated and offloaded from the browser (webview) and sent onto the mobile app to be handled natively. 

This is where `bridget`, when integrated properly, will handle these specific actions and send them off to be handled in the mobile app.

As an example, internally in the bridge, handling an `onclick` event originating from an `<a>` tag, would resemble something like:

```js
	onClickListener = e => {
		e.preventDefault()
		e.stopPropagation()
        // data can come from anywhere; page meta, element attribute, data attributes, linked data.
        // this particular example uses data attriutes
		const { title, url } = some.meta.data
		bridge.navigateToDoc({ url, title })
    }
```
#### Handling the event
In essence, how we handle click events within the WebView is through hijacking the `onlick` events within the web delivery.

This is done by having:
- `onclick` listeners that `bridget` registers for specific `html` elements 
- propagate those events from the listeners to decide (internally) how they should be handled
- decide what action should be sent back to the app to be handled natively. 

In other words, whenever something is clicked `bridget` is aware of this and uses some underlying data (metadata) and figures out which appropriate action to take.

As an example, how a navigation event is detected:
- All navigation events originate from anchor (`<a>`) tags, we add listeneres to them.
- If the anchor tag is clicked & contains an internal URL, then native navigation happens, i.e `navigateToDoc`. 
- If the anchor tag contains an external URL, then the external in-app browser is opened, i.e `navigateExternally`. 


### [Customize website styling](#customize-website-styling)

Any element that has been marked with the `webview-hidden` class in the web delivery(website) will be subject to handling via `bridget`

Whenever this class is added to an html component `bridget` will inject the CSS property `display: 'none'` to as a separate `style` attribute to the header, thus removing it from the viewport, as it will override any previous styling to it (cascading).