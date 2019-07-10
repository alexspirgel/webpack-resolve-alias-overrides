# Resolve Alias Overrides
A Webpack plugin for overriding resolve aliases.

## Example Usage:

```js
resolve: {
	plugins: [
		new ResolveAliasOverrides(
			{
				'@script': [
					path.resolve(__dirname, './components/main.js'),
					path.resolve(__dirname, './node_modules/index.js')
				]
			}
		)
	]
}
```

The above example will look for a file located at `./components/main.js`. If one is found, it will be used for the alias substitution value. If the file does not exist, perform the same check for the next path in the array, in this case `./node_modules/index.js`.