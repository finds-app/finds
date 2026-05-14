module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    // ── Vue ──────────────────────────────────────────────────────────────
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false,
      ignores: ['/^ion-/'],
    }],
    'vue/no-unused-vars': 'error',
    'vue/no-undef-components': ['error', { ignorePatterns: [/^[Ii]on/] }],
    'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'always', component: 'always' },
    }],
    'vue/no-v-html': 'error',
    'vue/padding-line-between-blocks': 'error',
    'vue/v-on-event-hyphenation': ['error', 'always', { autofix: true }],
    'vue/no-deprecated-slot-attribute': 'off',

    // Turn off HTML formatting rules — these belong in a formatter (Prettier),
    // not a linter, and they conflict with Tailwind's long class strings.
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off',

    // ── TypeScript ────────────────────────────────────────────────────────
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    // ── General ───────────────────────────────────────────────────────────
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'eqeqeq': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'object-shorthand': 'error',
  },
}
