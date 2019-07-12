class ResolveAliasOverrides {
	constructor(aliasOverridesObject) {
		// Set the alias overrides object to the class instance.
		this.aliasOverridesObject = aliasOverridesObject;
	}
	apply(resolver) {
		const target = resolver.ensureHook('resolve');
		resolver.getHook('described-resolve').tapAsync('ResolveAliasOverrides', (request, resolveContext, callback) => {
			// For each match string in the alias overrides object.
			for (const matchString in this.aliasOverridesObject) {
				// If the match string exists in the request path.
				if (request.request.indexOf(matchString) > -1) {
					// Get the aliases for the match string.
					const aliases = this.aliasOverridesObject[matchString];
					// For each alias.
					for (const aliasIndex in aliases) {
						// Get this alias.
						const alias = aliases[aliasIndex];
						// Replace the match string with this alias.
						const newRequestString = request.request.replace(matchString, alias);
						// If the file exists.
						if (fs.existsSync(newRequestString)) {
							const obj = Object.assign({}, request, {
								request: newRequestString
							});
							return resolver.doResolve(target, obj, "aliased with mapping '" + matchString + "': '" + alias + "' to '" + newRequestString + "'", resolveContext, (error, result) => {
								if (error) {
									return callback(error);
								}
								if (result === undefined) {
									return callback(null, null);
								}
								callback(null, result);
							});
						}
					}
				}
			}
			return callback();
		});
	}
}

module.exports = ResolveAliasOverrides;