module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: [
    '*.cjs',
    '**/build/*',
    '**/.svelte-kit/*',
    '**/node_modules/*',
  ],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn'],
    'a11y-media-has-caption': 'off',
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'comma-dangle': [1, 'always-multiline'],
    'curly': ['error', 'all'],
    'func-names': ['error', 'never'],
    'function-paren-newline': ['error', 'consistent'],
    'generator-star-spacing': ['error', {
      after: true,
      before: false,
    }],
    'id-blacklist': ['error', 'getDerivedStateFromProps'],
    'import/no-cycle': 'off',
    'import/no-named-as-default': 'off',
    // TODO: Consider re-enabling when perf improves
    'import/no-named-as-default-member': 'off',
    // TODO: Consider re-enabling when perf improves
    'import/prefer-default-export': ['off'],
    // This breaks our custom Link component. If/When we redo the Link component, we can revise this
    'jsx-a11y/anchor-is-valid': ['off'],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'max-len': ['warn', {
      code: 120,
      tabWidth: 4,
    }],
    'no-confusing-arrow': 'off',
    'no-console': ['warn', {
      allow: ['warn', 'error'],
    }],
    'no-continue': ['off'],
    'no-debugger': ['off'],
    'no-fallthrough': ['error', { 'commentPattern': 'break[\\s\\w]*omitted' }],
    'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 2, maxEOF: 0 }],
    'no-param-reassign': ['error', {
      ignorePropertyModificationsFor: ['draft'],
    }],
    'no-plusplus': 'off',
    'no-restricted-syntax': ['off'],
    'no-sequences': 'warn',
    'no-trailing-spaces': 'warn',
    'no-undef': 'off',
    'no-underscore-dangle': ['off'],
    'no-unused-vars': 'off',
    'object-curly-newline': ['error', {
      consistent: true,
      multiline: true,
    }],
    "object-curly-spacing": ["warn", "always"],
    'operator-linebreak': ['error', 'after'],
    'quotes': [2, 'single', 'avoid-escape'],
    'semi': 'warn',
    'sort-keys': ['off'],
    
    'yoda': ['off'],
  },
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
