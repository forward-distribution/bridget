# [Integration Guide](#integration-guide)
The basis of this document is to explain the process of integrating `bridget` into an existing web delivery with the sole purpose of adding bridging support to the website when browsed through the context of a mobile app via a WebView.

## [Prerequisites](#prerequisites)

#TODO

## [Requirements](#requirements)

#TODO - write requirements that the web delivery needs to satisfy in order for the module to work

## [How to install](#how-to-install)
> The module is designed to run in the browser. It can be used in node as well, but the primary target is  for  the browser.

### [Installation via script tag](#install-via-script-tag)
```html
<script src="https://unpkg.com/@forward-distribution/bridget">
  // Ideally the module will bootstrap itself when imported, if it is in the correct context (mobile webview)
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

## [Usage](#usage)
### Reacting to user actions.
Actions are something that a user performed on your website such as “Clicked on a teaser”, "Navigated to a page/department", or “Attempted to share”.

In the context of your webpage, the browser itself or your custom JavaScript code handles these user events, and reacts to them accordingly. 

In the mobile context, however, these actions need to be propagated and offloaded from the browser (webview), their default behaviour prevented, and sent onto the app, to be handled natively. This is where you, as an integrator, will need to have bridget integrated, so these specific actions can  be handled (see [api reference](#api)).

As an example, internally in the bridge, handling an `onclick` event originating from an `<a>` tag, would resemble something like:

```js
	onClickEvent = e => {
	if(window.ReactNativeWebView) {
		e.preventDefault()
		e.stopPropagation()
		const { title, slug, description } = e.currentTarget.dataset
		bridge.navigateToDocument({ url: slug, title: title })
        }
    }
```
Where the `onClickEvent` handler is something `bridget` binds to the webpage for all or specific elements, in this case an anchor tag.

# [API](#api)

In the API segment of the integration guide we will define all of the specific changes the delivery should support in order for it to be compatible with `bridget` and to function within the WebView context.

## Hijacking `onclick` events

The basic idea of how we handle essential click events within the WebView is through hijacking the `onlick` events within the web delivery.

What we mean by this is having `onclick` listeners that `bridget` registers for specific `html` elements, further propagate those events in order to decide (internally) how they should be handled, and which actions should be messaged back to the app and handled natively. 

In other words, whenever something is clicked `bridget` is aware of this and uses the underlying data properties supplied via the event target and figures out which appropriate action to take.

## Linking

The linking part of the API focuses on two things, article navigation and page navigation. Essentially, anywhere in the app where you have a link (the most typical example would be the `<a> ... </a>` tag)  `bridget` will hijack the `onclick` (`ontap` | `onpress`) event of this element and do something else instead, provided the correct data properties have been set, and it is an element that is on a watchlist, if you will. If such properties are not available, or the element is not on this so-called watchlist, nothing will happen, i.e. the event will just propagate to the other available listeners that are registered to it.

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
	<a  href="https://www.google.com"
        data-webview-path="https://www.google.com">
        Open google for me !
    </a>
```

## Linking type resolution

In order for `bridget` to be able to differentiate when between links when handling them, there is a possibility to inject custom logic for linking purposes. A good example for this would be to think about how exactly we define an article ? Would it contain an article slug, an article ID, or perhaps something else we should look for ? 

This is done entirely through regex during the `bridget` initialization phase.

Parameters:

- `articleResolutionRegex`
    - This parameter should serve as a test against a url to check if the url leads to an article
    
- `pageResolutionRegex`
    - This parameter should serve as a test against a url to check if the url leads to a page
    
Please keep in mind that these two regexes should:

- Be disjunct; we don't want a specific url to both test true against `articleResolutionRegex` and `pageResolutionRegex`
- Cover all articles and pages within the web delivery - if both of these fail the url will be considered to be an external one

## Social links

This is something we should get for free, provided the web delivery using `bridget` supports the opening of the social applications from the browser. As of now, no additional handling here is required.

## Sharing

Sharing is triggered through `bridget` once again by hijacking an `onClick` event that has specific properties. Additionally, it should contain some sharing metadata which we would need.

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

    - Whenever this property appears on some html component `bridget` and is true will inject the CSS property `display: 'none'` to it, thus removing it from the viewport
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
    

