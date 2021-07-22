# [Integration Guide](#integration-guide)
The basis of this document is to showcase the process of integrating `bridget` into an existing `website`,   henceforth referred to as `web delivery`.

At a high level, this would mean:

- A mobile app has been configured to point to a designated `web delivery`
- Bridget has been integrated into the `web delivery`
- The `web delivery` has been customized to tailor to the `bridget` requirements


The end goal is for you, as an integrator, to know how you can test your website in the context of a native mobile application and how you can adapt it for a better mobile experience.

## [Prerequisites](#prerequisites)

This integration guide assumes:
- A `web delivery` is present for a given publisher
- A mobile app for the publisher has been set up

## [How to install](#how-to-install)
> `bridget` is designed to run in the browser. It can also be used in a server (node.js) environment via npm.

### [Installation via script tag](#install-via-script-tag)
```html
<script src="https://unpkg.com/@forward-distribution/bridget">
  // The module will bootstrap itself when imported, if it is in the correct context (mobile webview)
</script>
```
Place the above `<script>...</script>` tag into the `<head>` tag of your HTML page. It will bootstrap itself & attach a global `bridget` object. You can access it either via `bridget` or `window.bridget`.

## [Alternative installation via NPM](#alternative-installation-via-npm)
The module is available on NPM, if you’re using a front-end packager like Browserify or Webpack:

Just run

```
npm install -g @forward-distribution/bridget
```

You can then `require` or `import` the lib like any other module.

# [API](#api)

In the API segment of the integration guide we will define what you get out-of-the-box when integrating `bridget` and all of the specific changes the `web delivery` should make in order for it to be compatible with and to function within the WebView context.

## [Linking](#api-linking)

The linking part of the API focuses on two things, document & external navigation.

Essentially, anywhere in the app where you have a link (e.g. `<a href='http://...'> link </a>` tag)  `bridget` will hijack the `onclick` (`ontap` | `onpress`) event of this element and do something else instead, provided the correct data properties have been set or are present on the web page. 

This happens by default when `bridget` is included in your website, and you don't need to setup or configure anything in your codebase.

### Exposed API

 If you want to manually trigger the navigation events, however, then you can use the exposed API from `bridget`:

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

> no arguments

```js
bridget.navigateToStartpage()
```

## [Sharing](#api-sharing)

Sharing is triggered through `bridget` once again by hijacking the `onclick` event on a specific element which has the specified class.


Required class:

|class name|description|optional|
|---|---|---|
|webview-social|Indicates that this is a social sharing link and should prompt the native share sheet.|false|

All you need to do is add the `css` class `webview-social` onto the clickable html tag, and `bridget` will take care of the rest.

The 2nd requirement is to have ***at least one*** of the following metadata formats available:


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
- if LDJson is not present, it will try with Open Graph data
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

 If you want to manually trigger the native share sheet, then you can use the exposed API from `bridget`:

---

### `shareDoc`
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

## Hiding specific web components

This part of the API focuses on removing certain components that might appear in the `web delivery that don't make sense in a mobile context or have a native counterpart component.

A few examples that come to mind would be the headers, burger menu, footers, sitemap or anything the `web delivery has, that **should not appear** in the WebView.

To simply hide an element in the mobile context, you need to add this `css` class to it:

|class name|description|optional|
|---|---|---|
|webview-hidden|When bridget "sees" this class, it will remove that specific element from the viewport.|false|

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
    

