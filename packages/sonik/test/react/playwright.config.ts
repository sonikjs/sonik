import config from '../playwright.config.base'

config.webServer = {
  command: 'yarn vite --port 6173 -c ./vite.config.ts',
  port: 6173,
  reuseExistingServer: !process.env.CI,
}

export default config
