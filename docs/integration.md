# [Integration Guide](#integration-guide)
The basis of this document is to familiarize the user, a.k.a. integrator, with the process of integrating `bridget` into an existing `website`,  henceforth referred to as a `web delivery`.

At a high level, an integration would mean:

- A Forward Publishing Mobile App has been configured to point to a designated `web delivery`
- Bridget has been integrated into the `web delivery`
- The `web delivery` has been customized to tailor to the `bridget` requirements


The end goal is for you, as an integrator, to know how you can test your website in the context of a native mobile application and how you can adapt it for a better mobile experience.

## [Prerequisites](#prerequisites)

This integration guide assumes:
- A `web delivery` is present for a given publisher
- A Forward Publishing Mobile App for the publisher has been set up

## [How to install](#how-to-install)
> `bridget` is designed to run in the browser.

### Installation via script tag
```html
<script type="module" src="https://unpkg.com/@forward-distribution/bridget@:version/dist/bridget.js">
  // The module will bootstrap itself when imported, if it is in the correct context (mobile webview)
</script>
<!-- fallback for older browsers -->
<script nomodule src="https://unpkg.com/@forward-distribution/bridget@:version/dist/legacy/bridget.js"></script>
```
Place the above `<script>...</script>` tag into the `<head>` tag of your HTML page. It will bootstrap itself & attach a global `bridget` object. You can access it either via `bridget` or `window.bridget`.

<!---
## [Alternative installation via NPM](#alternative-installation-via-npm)
The module is available on NPM, if you’re using a front-end packager like Browserify or Webpack:
Just run

```
npm install -g @forward-distribution/bridget
```

You can then  or `import` the lib like any other module. The library is using esm. You'd have to call
initBridget() yourself.
--->


# [API](#api)

In the API segment of the integration guide we will define what you get out-of-the-box when integrating `bridget` and all of the specific changes the `web delivery` should make in order for it to be compatible with `bridget` and to function within the WebView context.

## [Linking](#api-linking)

The linking part of the API focuses on navigation.

Essentially, anywhere in the app where there is a navigation hyperlink (e.g. `<a href='http://...'> link </a>` tag) `bridget` will take over the event and do the navigation, provided the correct data properties have been set or are present on the web page. 

This happens by default when `bridget` is included in your website, and you don't need to setup or configure anything in your codebase.

### Exposed API

If you want to manually trigger the navigation events, however, then you can use the exposed API from `bridget`.
Since it's present in the `window` object, you can use it as:

---

### `window.bridget.navigateToDoc`
Navigates to a specified location (document, article, page, etc.) via the supplied url.

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

### `window.bridget.navigateExternally`
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

## [Sharing](#api-sharing)

Sharing is triggered through `bridget` by overriding the default web action and passing it on to the native sharing functionality. 

All you need to do is add the `css` class `fp-bridget__webview-social` onto the clickable html tag, and `bridget` will take care of the rest.

Required class:

|class name|description|optional|
|---|---|---|
|`fp-bridget__webview-social`|Indicates that this is a social sharing link and should prompt the native share sheet.|false|


The 2nd requirement is to have ***at least one*** of the following metadata formats available:


[LDJson metadata](https://json-ld.org/)
***
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

  if LDJson is not present, it will try with [Open Graph protocol](https://ogp.me/)
  ***

```html
    <meta property="og:url" content="https://publisher.com/sport/random-article">
    <meta property="og:type" content="article">
    <meta property="og:title" content="Random article">
    <meta property="og:description" content="Lorem ipsum article...">
```

if both of the above are not  present, it will default back to `document`, `location` & [meta tag](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML) data.
***

```html
    <meta name="title" content="Random article">
    <meta name="description" content="SLorem ipsum article...">
```

### Exposed API

 If you want to manually trigger the native share sheet, then you can use the exposed API from `bridget`:

---

### `window.bridget.shareDoc`
Opens a native share sheet with the supplied spec.

| Prop  | Required | Type |
| ------------| --------- | ------------|
| url         | Yes       | String      |
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

---

### `window.bridget.propagateContentRectangle`
This method propagates the article's bounding rectangle properties.

| Prop   | Required | Type   |
|--------| --------- |--------|
| top    | Yes       | Number |
| left   | Yes       | Number |
| width  | Yes       | Number |
| height | Yes       | Number |

```js
/**
 * @typedef {object} spec
 * @property {number} top - The y-coordinate of the rectangle's top edge.
 * @property {number} left - The x-coordinate of the rectangle's left edge.
 * @property {number} width - The width of the rectangle.
 * @property {number} height - The height of the rectangle.
 */
bridget.propagateContentRectangle(spec)
```

## Hiding specific web components

This part of the API focuses on removing certain components that might appear in the `web delivery that don't make sense in a mobile context or have a native counterpart component.

A few examples that come to mind would be the headers, burger menu, footers, sitemap or anything the `web delivery has, that **should not appear** in the WebView.

To simply hide an element in the mobile context, you need to add this `css` class to it:

|class name|description|optional|
|---|---|---|
|`fp-bridget__webview-hidden`|When bridget "sees" this class, it will remove that specific element from the viewport.|false|

Example:

```html
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

```html
	<header class="... fp-bridget__webview-hidden">
           <p>First item</p>
           <p>Second item</p>
           .
           .
           .
           <p>Last item</p>
    <header/>
```
    

