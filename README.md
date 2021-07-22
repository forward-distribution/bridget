# Bridget

[![npm version](https://img.shields.io/npm/v/@forward-distribution/bridget?color=green&label=@forward-distribution/bridget)]()
[![GitHub Issues Open](https://img.shields.io/github/issues/forward-distribution/bridget)]()

This repository contains the bridging functionality — aptly named Bridget — that will be used as a communication tool between the clients (usually web deliveries) & the Forward Publishing mobile app's webview implementation.

# Why a bridge
 If a client from our Forward Publishing suite requires a mobile app, we offer a native solution to their publishing platform, i.e their web delivery. 
 
 Although it mirrors the web delivery 1:1 in terms of content and displays it in a mobile friendly webview, some functionality needs to be communicated from the web world to the mobile native world. Linking or navigation in the web does not behave the same way in the mobile app, simply changing a URL in a webview will not do, as it destroys the native immersion and context of what's happening within the app is lost. 

 That's where Bridget comes in; we can think of it as a thin communicational layer between the web delivery and the mobile app, where functionality in the app is being invoked by message passing (think of Android intents) from the bridge, and vice versa.

# [Docs](#docs)

Check out the [documentation](https://forward-distribution.github.io/bridget/). 
 
# [Changelog](#changelog)

See the [change log](./CHANGELOG.md) for the latest release information.

