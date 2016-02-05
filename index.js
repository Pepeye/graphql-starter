import config from './config'
import app from './src/server'
import _debug from 'debug'

const debug = _debug('api:server')

app.listen(config.port, config.host, () => {
  debug(`Starting server`)
  console.log(`
    Server Started
    =============================
    Env  : ${process.env.NODE_ENV}
    host : ${config.host}
    Port : ${process.env.PORT}
    -----------------------------
   `)
})
