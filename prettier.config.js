/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  proseWrap: 'preserve',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
  overrides: [
    {
      files: '*.scss',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
  ],
};

module.exports = config;
