import eslint from '@eslint/js';
import {configs as tseslintConfigs} from 'typescript-eslint';

const {configs: eslintConfigs} = eslint;

export default [
  {
    files: [
      'src/**/*.ts'
    ]
  },
  eslintConfigs.recommended,
  ...tseslintConfigs.strict,
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": ["error", {
        "allowExpressions": true
      }],
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/member-delimiter-style": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/parameter-properties": "error",
      "@typescript-eslint/no-invalid-void-type": "off"
    }
  }
];
