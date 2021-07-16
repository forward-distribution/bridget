# [Integration Guide](#integration-guide)
The basis of this document is to chowcase the process of integrating `bridget` into an existing web delivery. The end-goal of this module is adding bridging support to the website when browsed through the context of a mobile app via a WebView.

## [Prerequisites](#prerequisites)

#TODO - 

## [Requirements](#requirements)

#TODO - write requirements that the web delivery needs to satisfy in order for the module to work

## [How to install](#how-to-install)
> The module is designed to run in the browser. It can be used in node as well, but the primary target is  for  the browser.

### [Installation via script tag](#install-via-script-tag)
```html
<script src="https://unpkg.com/@forward-distribution/bridget">
  // The module will bootstrap itself when imported, if it is in the correct context (mobile webview)
</script>

```
Put the above script tags in between the <head> tags of your HTML page. It will attach a global `bridget` object. You can access it either via `bridget` or `window.bridget`.

## [Alternative installation via NPM](#alternative-installation-via-npm)
The module is available on NPM & as a github package which can be used if you’re using a front-end packager like Browserify or Webpack:

Just run

```
npm install -g @forward-distribution/bridget
```

You can then `require` or `import` the lib like any other module

## [Usage](#usage)
### Reacting to user actions
Actions are something that a user performed on your website such as “*Clicked on a teaser*”, "*Navigated to a page/department*", or “*Attempted to share*”.

In the context of your webpage, the browser itself or your custom JavaScript code handles these user events, and reacts to them accordingly. 

In the mobile context, however, these actions need to be propagated and offloaded from the browser (webview), their default behaviour prevented, and sent onto the app, to be handled natively. 

This is where you, as an integrator, will need to have bridget integrated, so these specific actions can  be handled (see [api reference](#api)).

As an example, internally in the bridge, handling an `onclick` event originating from an `<a>` tag, would resemble something like:

```js
	onClickListener = e => {
		e.preventDefault()
		e.stopPropagation()
        // data can come from anywhere; page meta, element attribute, data attributes, linked data.
        // this particular example uses data attriutes
		const { title, url } = e.currentTarget.dataset
		bridge.navigateToDocument({ url, title })
    }
```
Where `onClickListener` is something `bridget` binds to the webpage for all elements or specific elements; in this case, it's for all anchor tags.

# [API](#api)

In the API segment of the integration guide we will define all of the specific changes the delivery should support in order for it to be compatible with `bridget` and to function within the WebView context.

## Hijacking `onclick` events

The basic idea of how we handle essential click events within the WebView is through hijacking the `onlick` events within the web delivery.

What we mean by this is having `onclick` listeners that `bridget` registers for specific `html` elements, further propagate those events in order to decide (internally) how they should be handled, and which actions should be messaged back to the app and handled natively. 

In other words, whenever something is clicked `bridget` is aware of this and uses some underlying data (metadata) and figures out which appropriate action to take.

## Linking

The linking part of the API focuses on two things, article, page & external navigation. 

Essentially, anywhere in the app where you have a link (e.g. `<a href='http://...'> link </a>` tag)  `bridget` will hijack the `onclick` (`ontap` | `onpress`) event of this element and do something else instead, provided the correct data properties have been set or are present on the web page. 

If such data (metadata) is not available, nothing will happen, i.e. the event will just propagate to the other available listeners that are registered to it.

How it works internally
- All the navigation events happen on the anchor (`<a>`) tags. If the anchor tag contains an internal URL, then native navigation happens. If the anchor tag contains external an URL, then the external in-app browser is opened. This happens by default, and you don't need to setup or configure anything.
- If you want to override this behaviour, then the following things need to be added as metadata to your anchor tags.

| attributes|value|description|optional|
|---|---|---|---|
| data-webview|true|Tells us whether we should process this tag when in the context of a webview|false|
|data-src|`http://example.delivery/article/some-article-href`|The destination where this anchor tag is linking (navigating) to.|false|

**Example**:
```js
	<a href="http://example.delivery/article/some-article-href">Teaser</a>
```
would become 
```js
	<a 
      data-webview="true"
      data-src="http://example.delivery/article/some-article-href"
      href="http://example.delivery/article/some-article-href">
      Teaser
    </a>
```
- If you want to enhance the behaviour of navigation (native title for example), then the following optional attributes can be added to your anchor tags.
  

|attributes|value|description|optional|
|---|---|---|---|
| data-title|Some title|Tells us whether we should process this tag when in the context of a webview|true|
- If you want to manually trigger the navigation events (native navigation, in-app browser), then you can use the exposed internal API from `bridget`:
```js
/**
 * @typedef {object} spec
 * @property {string} url - the location of the resource
 * @property {string|undefined} title - [optional] title of the resource
 */
bridget.navigateToArticle(spec)
```

## Linking type resolution

In order for `bridget` to be able to differentiate between links when handling them, there is a need custom linking logic. A good example for this would be to think about how exactly we define an article URL? Would it contain (in its path) an article slug, an article ID, or perhaps another parameter.
> TODO: url handling
> 
## Social links

> TODO: social link handling

## Sharing

Sharing is triggered through `bridget` once again by hijacking the `onclick` event on a specific element. Additionally, metadata on what to share should also be available.


Required data properties:
|attributes|value|description|optional|
|---|---|---|---|
| data-webview-social|true|Indicates that this is a social sharing link and should prompt the native share sheet.|false|

By default, when a social sharing link is clicked, it will try to extract the metadata from the data attribute tags
|attributes|value|description|optional|
|---|---|---|---|
| data-webview-share-url|http://share-url|The URL of the document being shared. It should be an absolute path to the document we want to share.|true|
| data-webview-share-title|[title of the document being shared]|It should typically be the title of the document (article/page for example) we are trying to share.|true|
| data-webview-share-description| [description of the document]|Refers to the basic subtext that comes with sharing a document. It should typically be either a subtitle, a short abstract of the document or some other excerpt.|true|
    
Example:

```js
<div>
    <span>{articleTitle}</span>
    <span>{articleDescription}</span>
    <div>
        // ... the article content
    </div>
	<button href="https://www.facebook.com/sharer/....">
        Share
    <button/>
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
	<button 
        href="https://www.facebook.com/sharer/...."
        data-webview-social={true}
        data-webview-share-url={metadata.url}
	    data-webview-share-title={articleTitle}
	    data-webview-share-description={articleDescription}>
        Share
    <button/>
</div>
```

## Hiding specific web components

This part of the API focuses on removing certain components that might appear in the web delivery that don't make sense in a mobile context or have a native counterpart component. 

A few examples that come to mind would be the headers, burger menu, footers, sitemap or anything your web delivery has that **should not appear** in the WebView.

Required data properties:
|attributes|value|description|optional|
|---|---|---|---|
|data-webview-hide|true|Whenever this property appears on some html component `bridget`  will inject the CSS property `display: 'none'` to it, thus removing it from the viewport.|false|


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
This will essentially remove the entire component from the viewport once bridget iterates the DOM tree and finds all elements that have this data attribute.
    

