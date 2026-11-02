import express from 'express'
import path from 'path'
import { initialize } from 'express-openapi'
import { db } from './database'

const app = express()
const port = 3000

// Not all routes need to be handled via OpenAPI specification
app.get('/adportal', (_req, res) => {
  res.send({ name: 'Ad Portal not handled via OpenAPI' })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))

initialize({
  app,
  apiDoc: path.resolve(__dirname, '../openapi.json'),
  validateApiDoc: true,

  operations: {
    // For each OpenAPI operationId...
    getRoot: [
      // Add middleware like this
      function (_req, _res, next) {
        next()
      },
      // Handle and send response
      async function (_req, res, next) {
        try {
          const count = await db.user.count()
          res.send({ message: `Hello world, this is the root page! We have ${count} users` })
        } catch (error) {
          next(error)
        }
      }
    ],
    getUser: [
      async function (req, res, next) {
        try {
          const count = await db.user.count()
          const name = typeof req.query.name === 'string' ? req.query.name : 'anonymous'
          res.send({ message: `Hello world, this ${name}'s page! We have ${count} users` })
        } catch (error) {
          next(error)
        }
      }
    ]
  },
  // errorMiddleware handles validation errors in Request object, e.g. missing params
  errorMiddleware: (err, _req, res, _next) => {
    const status = typeof err.status === 'number' ? err.status : 500
    res.status(status).json(err)
  }
})
