module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 2018
	},
	"rules": {
		"default-case": [
			"error"
		],
		"eol-last": [
			"error",
			"always"
		],
		"eqeqeq": [
			"error",
			"always"
		],
		"indent": [
			"error",
			2,
			{
				"SwitchCase": 1
			}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"no-console": [
			"error",
			{
				"allow": [
					"warn",
					"error"
				]
			}
		],
		"no-magic-numbers": [
			"warn"
		],
		"no-multi-spaces": [
			"error"
		],
		"no-process-exit": [
			"error"
		],
		"no-trailing-spaces": [
			"error"
		],
		"no-var": [
			"error"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
