import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = [
	{
		ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
	},
	{
		files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"@next/next": nextPlugin,
			"import-x": importPlugin,
			"react-hooks": reactHooks,
		},
		rules: {
			...nextPlugin.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"import-x/no-anonymous-default-export": "warn",
		},
	},
	{
		files: ["**/*.{ts,tsx,mts,cts}"],
		languageOptions: {
			parser: tseslint.parser,
		},
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		rules: {
			...tseslint.configs.recommended.rules,
		},
	},
];

export default eslintConfig;
