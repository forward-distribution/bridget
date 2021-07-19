# [Integration Guide](#integration-guide)
The basis of this document is to chowcase the process of integrating `bridget` into an existing web delivery. The end-goal of this module is adding bridging support to the website when browsed through the context of a mobile app via a WebView.

## [Prerequisites](#prerequisites)

This integration guide assumes you already have a web delivery that serves content & a mobile app is being setup for that  particular web delivery.

## [Requirements](#requirements)

#TODO - write requirements that the web delivery needs to satisfy in order for the module to work

## [How to install](#how-to-install)
> The module is designed to run in the browser. It can also be used in a server (node) environment via npm.

### [Installation via script tag](#install-via-script-tag)
```html
<script src="https://unpkg.com/@forward-distribution/bridget">
  // The module will bootstrap itself when imported, if it is in the correct context (mobile webview)
</script>
```
Put the above script tags in between the <head> tags of your HTML page. It will attach a global `bridget` object. You can access it either via `bridget` or `window.bridget`.

## [Alternative installation via NPM](#alternative-installation-via-npm)
The module is available on NPM, if you’re using a front-end packager like Browserify or Webpack:

Just run

```
npm install -g @forward-distribution/bridget
```

You can then `require` or `import` the lib like any other module.

## [Internals](#internal)
### Reacting to user actions
Actions are something that a user performed on your website such as “*Clicked on a teaser*”, "*Navigated to a page/department*", or “*Attempted to share*”.

In the context of your webpage, the browser itself or your custom JavaScript code handles these user events, and reacts to them accordingly. 

In the mobile context, however, these actions need to be propagated and offloaded from the browser (webview) and sent onto the mobile app to be handled natively. 

This is where you, as an integrator, will need to have bridget integrated, so these specific actions can  be handled (see [api reference](#api)).

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
`onClickListener` is just an implementation detail, nothing you as an integrator should worry about; it is something `bridget` binds to the webpage for all elements or specific elements; in this case, it's for all anchor tags.

# [API](#api)

In the API segment of the integration guide we will define all of the specific changes the delivery should support in order for it to be compatible with `bridget` and to function within the WebView context.

## Hijacking `onclick` events

The basic idea of how we handle essential click events within the WebView is through hijacking the `onlick` events within the web delivery.

What we mean by this is having:
- `onclick` listeners that `bridget` registers for specific `html` elements 
- propagate those events from the listeners to decide (internally) how they should be handled
- decide what action should be sent back to the app to be handled natively. 

In other words, whenever something is clicked `bridget` is aware of this and uses some underlying data (metadata) and figures out which appropriate action to take.

## [Linking](#api-linking)

The linking part of the API focuses on two things, document & external navigation. 

Essentially, anywhere in the app where you have a link (e.g. `<a href='http://...'> link </a>` tag)  `bridget` will hijack the `onclick` (`ontap` | `onpress`) event of this element and do something else instead, provided the correct data properties have been set or are present on the web page. 

If such data (metadata) is not available, nothing will happen, i.e. the event will continue its normal flow.

How it works internally
- All  navigation events originate from anchor (`<a>`) tags. 
- If the anchor tag contains an internal URL, then native navigation happens. 
- If the anchor tag contains an external URL, then the external in-app browser is opened. 

This happens by default, and you don't need to setup or configure anything in your codebase.

### Exposed API

 If you want to manually trigger the navigation events (native navigation, in-app browser), then you can use the exposed internal API from `bridget`:

---

### `navigateToDoc`
Navigates to a specified document (article, page, etc.) via the supplied url.

| Prop  | Required | Type |
| ------| -------- | ------------|
| url   | Yes      | String      |
| title | No       | String      |

```js
/**
 * @typedef {object} spec
 * @property {string} url - the location of the resource
 * @property {string|undefined} title - [optional] title of the resource
 */
bridget.navigateToDoc(spec)
```

### `navigateExternally`
Opens an in-app browser with the supplied url.
| Prop  | Required | Type |
| ------| -------- | ------------|
| url   | Yes      | String      |
```js
/**
 * @typedef {object} spec
 * @property {string} url - the location of the resource
 */
bridget.navigateExternally(spec)
```

### `navigateToStartpage`
Pops the entire navigation stack and returns back to the start page.
| Prop  | Required | Type |
| ------| -------- | ------------|
x

```js
bridget.navigateToStartpage()
```

## [Social links](#api-social-links)

> TODO: social link handling

## [Sharing](#api-sharing)

Sharing is triggered through `bridget` once again by hijacking the `onclick` event on a specific element which has the specified class.


Required class:

|class name|description|optional|
|---|---|---|
|webview-social|Indicates that this is a social sharing link and should prompt the native share sheet.|false|

By default, when a social sharing link is clicked, it will try to extract the metadata (url, title, description) from multiple sources in the following order:
- LDJson metadata
```html
<script type="application/ld+json">
{
   "@context":"https://schema.org",
   "@type":"NewsArticle",
   "mainEntityOfPage":{
      "@type":"WebPage",
      "@id":"https://publisher.com/sport/random-article"
   },
   "title":"Random article",
   "datePublished":"2021-07-14T16:55:00+02:00",
   "dateModified":"2021-07-14T18:03:00+02:00",
   "description":"Lorem ipsum article...",
   "author":[
      {
         "@type":"Person",
         "name":"Filip Boev"
      }
   ]
}
</script>
```
- if not present, it will try with Open Graph data
```html
    <meta property="og:url" content="https://publisher.com/sport/random-article">
    <meta property="og:type" content="article">
    <meta property="og:title" content="Random article">
    <meta property="og:description" content="Lorem ipsum article...">
```
- if not present, it will default back to `document`, `location` & plain `meta` tag data.
```html
    <meta name="title" content="Random article">
    <meta name="description" content="SLorem ipsum article...">
```

### Exposed API

 If you want to manually trigger the native share sheet, then you can use the exposed internal API from `bridget`:

---

### `shareDoc`
Opens a native share sheet with the supplied spec.
| Prop  | Required | Type |
| ------------| -------- | ------------|
| url         | Yes      | String      |
| title       | Yes       | String      |
| description | Yes       | String      |
```js
/**
 * @typedef {object} spec
 * @property {string} url - the location of the resource
 * @property {string} title - title of the resource
 * @property {string} description - description of the resource
 */
bridget.shareDoc(spec)
```

## Hiding specific web components

This part of the API focuses on removing certain components that might appear in the web delivery that don't make sense in a mobile context or have a native counterpart component. 

A few examples that come to mind would be the headers, burger menu, footers, sitemap or anything your web delivery has that **should not appear** in the WebView.

To simply hide an element in the mobile context, you need to add this `css` class to it:

|class name|description|optional|
|---|---|---|
|webview-hidden|Whenever this class is added to an html component `bridget`  will inject the CSS property `display: 'none'` to it, thus removing it from the viewport.|false|

Example:

```js
	<header>
           <p>First item</p>
           <p>Second item</p>
           .
           .
           .
           <p>Last item</p>
    <header/>
```

would become

```js
	<header class="... webview-hidden">
           <p>First item</p>
           <p>Second item</p>
           .
           .
           .
           <p>Last item</p>
    <header/>
```
This will essentially remove the entire component from the viewport once `bridget` iterates the DOM tree and finds all elements that have this data attribute.
    

