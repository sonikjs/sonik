export default {
  testMatch: ['**/test/**/*.+(ts|tsx)'],
  transform: {
    '^.+\\.(ts)$': 'esbuild-jest',
  },
}
