module.exports = {

	extends: [
		'eslint:recommended'
	],

	globals: {
		__dirname: false,
		console: false,
		exports: false,
		module: false,
		process: false
	}, // globals

	parser: 'babel-eslint',

	plugins: [
		'import'
	],

	rules: {
		'comma-dangle': ['error', {
			arrays: 'ignore',
			objects: 'never',
			imports: 'never',
			exports: 'never',
			functions: 'ignore'
		}],
		indent: ['warn', 'tab'],
		'no-tabs': ['off'],
		semi: 'error'
	} // rules

}; // module.exports
