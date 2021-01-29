# Webpack server-side javascript

## Install

```
npm install --save-dev @enonic/webpack-server-side-js
```

## Usage

```
import {webpackServerSideJs} from '@enonic/webpack-server-side-js';

const SERVER_SIDE_JS_CONFIG = webpackServerSideJs({
	__dirname
});

const WEBPACK_CONFIG = [
  SERVER_SIDE_JS_CONFIG
];

export { WEBPACK_CONFIG as default };
```

## What does it do

It compiles these:
```
./src/main/resources/**/*.es
./src/main/resources/**/*.es6
./src/main/resources/**/*.js
```

Except these:
```
./src/main/resources/assets/**/*.es
./src/main/resources/assets/**/*.es6
./src/main/resources/assets/**/*.js
```

Into:
```
./build/resources/main/**/*.js
```

## Changelog

### 0.9.0

* maxModules removed in webpack 5

### 0.8.0

* Got webpack 5 to work in some projects

### 0.7.0

* Exclude core-js, regenerator-runtime and webpack from transpiling
* Use corejs 3 in webpack
* Use esmodules false, because Enonic XP doesn't support ECMAScript Modules
* Downgrade buildsystem to Node 12.20.1 since we're stuck on webpack 4

### 0.6.0

* Node 14.15.4
* Upgrade node modules (patch and minor)

### 0.5.0

* Try @babel/preset-env target node 0.10.48

### 0.4.0

* Only use @babel/preset-env with corejs 3 and useBuiltIns usage
* Don't use @babel/plugin-transform-runtime

### 0.3.0

* Trying @babel/preset-env targets esmodules true and @babel/plugin-transform-runtime regenerator: true to avoid "regeneratorRuntime" is not defined
* Do not minimize
* Removed terser-webpack-plugin

### 0.2.0

* Removed transform-es2017-object-entries because it's for babel 6, not 7

### 0.1.2

* Add @babel/plugin-transform-classes

### 0.1.1

* Add @babel/plugin-transform-modules-commonjs
