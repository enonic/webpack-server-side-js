import glob from 'glob';
import path from 'path';
//import UglifyJsPlugin from 'uglifyjs-webpack-plugin'; // Supports ECMAScript2015
//import webpack from 'webpack';

const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));
// const toStr = v => JSON.stringify(v, null, 4);

const SRC_DIR = 'src/main/resources';
const SRC_ASSETS_DIR = `${SRC_DIR}/assets`;
const DST_DIR = 'build/resources/main';

export function webpackServerSideJs(params) {
	const { __dirname } = params;
	if (!__dirname) {
		throw new Error('webpackStyleAssets: __dirname is a required parameter');
	}
	const {
		context = path.resolve(__dirname, SRC_DIR),

		extensions = ['es', 'es6', 'js'],
		extensionsGlob = `{${extensions.join(',')}}`,
		assetsGlob = `${SRC_ASSETS_DIR}/**/*.${extensionsGlob}`,
		serverSideFiles = glob.sync(`${SRC_DIR}/**/*.${extensionsGlob}`, {
			ignore: assetsGlob
		}),
		entry = dict(
			serverSideFiles.map(k => [
				k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
				`.${k.replace(SRC_DIR, '')}` // source relative to context
			])
		),

		externals = [/^\//],

		devtool = false,

		mode = 'production',

		optimization = {
			minimize: false/*,
			minimizer: [
				new UglifyJsPlugin({
					parallel: true,
					sourceMap: false
				})
			]*/
		},

		outputFilename = '[name].js',
		outputPath = path.join(__dirname, DST_DIR),
		/* output = {
			filename: outputFilename,
			path: outputPath,
		},*/

		performanceHints = false,
		/* performance = {
			hints: performanceHints
		},*/

		plugins = [],

		resolveAlias,// = {},
		resolveExtensions = [
			'mjs',
			'jsx',
			'esm',
			'es',
			'es6',
			'ts',
			'tsx',
			'js',
			'json'
		],
		resolve = {
			alias: resolveAlias,
			extensions: resolveExtensions.map(ext => `.${ext}`)
		},

		stats = {
			colors: true,
			hash: false,
			//maxModules: 0, // Removed in webpack 5
			modules: false,
			moduleTrace: false,
			timings: false,
			version: false
		}
	} = params;
	/* console.log(toStr({
		__dirname,
		context,
		extensions,
		extensionsGlob,
		assetsGlob,
		serverSideFiles,
		entry,
		externals,
		devtool,
		mode,
		plugins,
		resolve
	}));*/

	/*if (!resolve.alias.myGlobal) {
		resolve.alias.myGlobal = path.resolve(__dirname, './global');
	}*/

	if (!serverSideFiles.length) {
		console.error('Webpack did not find any files to process!');
		process.exit();
	}

	const serverSideWebpackConfig = {
		context,
		entry,
		externals,
		devtool,
		mode,
		module: {
			rules: [
				{
					test: /\.(es6?|tsx?|js)$/, // Will need js for node module depenencies
					exclude: [
						/\bcore-js\b/,
						/\bwebpack\b/,
						/\bregenerator-runtime\b/,
					],
					use: [
						{
							loader: 'babel-loader',
							options: {
								babelrc: false, // The .babelrc file should only be used to transpile config files.
								comments: false,
								compact: false,
								minified: false,
								plugins: [
									'@babel/plugin-proposal-class-properties',
									'@babel/plugin-proposal-export-default-from',
									'@babel/plugin-proposal-object-rest-spread',
									'@babel/plugin-syntax-dynamic-import',
									'@babel/plugin-syntax-throw-expressions',
									'@babel/plugin-transform-classes',
									'@babel/plugin-transform-modules-commonjs',
									'@babel/plugin-transform-object-assign',
									/*[
										'@babel/plugin-transform-runtime',
										{
											absoluteRuntime: false,
											corejs: false,
											helpers: false, // Default is true. Toggles whether or not inlined Babel helpers (classCallCheck, extends, etc.) are replaced with calls to moduleName.
											regenerator: true,
											useESModules: false//,
											//version: '7.11.5'
										}
									],*/
									'array-includes'
								],
								presets: [
									//'@babel/preset-typescript', // Why did I ever add this???
									[
										'@babel/preset-env',
										{
											//corejs: '3.8.3', // gives $ is not a function
											corejs: 3, // Needed when useBuiltIns: usage

											// Default is false
											// Outputs the targets/plugins used and the version specified in plugin data version to console.log
											//debug: true, // A lot of output

											// Enables all transformation plugins and as a result,
											// your code is fully compiled to ES5
											forceAllTransforms: true,

											// Default is []
											// An array of plugins to always include
											//include: [],

											// Default is false.
											// Enable "loose" transformations for any plugins in this preset that allow them.
											//loose: false,

											// "amd" | "umd" | "systemjs" | "commonjs" | false, defaults to "commonjs"
											//  Enable transformation of ES6 module syntax to another module type.
											// Setting this to false will not transform modules.
											//modules: 'commonjs',
											//modules: false,

											// Default is false.
											// Enable more spec compliant, but potentially slower,
											// transformations for any plugins in this preset that support them.
											//spec: true,

											targets: {
												esmodules: false, // Enonic XP doesn't support ECMAScript Modules

												// https://node.green/
												node: '0.10.48'
												//node: '5.12.0'

												// enables all transformation plugins and as a result,
												// your code is fully compiled to ES5.
												// However, the useBuiltIns option will still work as before
												// and only include the polyfills that your target(s) need
												//uglify: true // The uglify target has been deprecated. Set the top level option `forceAllTransforms: true` instead.
											},

											//useBuiltIns: false // no polyfills are added automatically
											//useBuiltIns: 'entry' // replaces direct imports of core-js to imports of only the specific modules required for a target environment
											useBuiltIns: 'usage' // polyfills will be added automatically when the usage of some feature is unsupported in target environment
										}
									]
								]
							} // options
						}
					]
				}
			]
		}, // module
		optimization,
		output: {
			path: outputPath,
			filename: outputFilename,
			libraryTarget: 'commonjs'
		},
		performance: {
			hints: performanceHints
		},
		plugins,
		/*plugins: [
			new webpack.ProvidePlugin({
				global: 'myGlobal'
			})
		].concat(plugins),*/
		resolve,
		stats
	};
	// console.log(toStr({ serverSideWebpackConfig }));
	return serverSideWebpackConfig;
} // function webpackEsmAssets
