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