/*
 * @Author: legends-killer
 * @Date: 2023-12-27 20:33:36
 * @LastEditors: legends-killer
 * @LastEditTime: 2023-12-27 20:58:41
 * @Description:
 */
module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
