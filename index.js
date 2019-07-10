class ResolveAliasOverrides {
	constructor(aliasOverridesObject) {
		this.aliasOverridesObject = aliasOverridesObject;
	}
	apply(resolver) {
		const target = resolver.ensureHook('resolve');
		resolver.getHook('described-resolve').tapAsync('ResolveAliasOverrides', (request, resolveContext, callback) => {
			for (const alias in this.aliasOverridesObject) {
				const thisAlias = this.aliasOverridesObject[alias];
				if (request.request.indexOf(alias) > -1) {
					for (const path in thisAlias) {
						const thisPath = thisAlias[path];
						const newRequestStr = request.request.replace(alias, thisPath);
						if (fs.existsSync(newRequestStr)) {
							const obj = Object.assign({}, request, {
								request: newRequestStr
							});
							return resolver.doResolve(target, obj, "aliased with mapping '" + alias + "': '" + thisPath + "' to '" + newRequestStr + "'", resolveContext, (err, result) => {
								if (err) {
									return callback(err);
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