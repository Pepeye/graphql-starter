import path from 'path'
// import { argv } from 'yargs'

const config = {
  env: process.env.NODE_ENV,
  /**
   * Project Structure
   */

  src: 'src',
  public: 'public',
  test: 'tests',
  favicon: path.resolve(__dirname, '../public/images/favicon.ico'),

  /**
   * server configuration
   */
  host: 'localhost',
  port: process.env.PORT || 3000
}

export default config
