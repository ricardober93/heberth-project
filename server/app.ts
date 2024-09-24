import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

import { manager } from './routes/manager'
import { auth } from './routes/auth'

const app = new Hono()

const managerRoute  = app.basePath("/api").route('/manager', manager).route('/', auth)

app.use('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app 


export type ApiManager = typeof managerRoute
