import express, { Request, Response, NextFunction } from 'express'
import { initialize } from 'express-openapi'
import { db } from './database/index'
import path from 'path'

const app = express()
const port = 3000

// Not all routes need to be handled via OpenAPI specification
app.get('/adportal', async (req, res) => {
    res.send({ name: `Ad Portal not handled via OpenAPI` })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))

initialize({
    app: app,
    apiDoc: path.resolve(__dirname, "../openapi.json"),
    validateApiDoc: true,
    
    operations: {
        // For each OpenAPI operationId...
        getRoot: [
            // Add middleware like this
            function (req: Request, res: Response, next: NextFunction) {
                next()
            },
            // Handle and send response
            async function (req: Request, res: Response) {
                let count = await db.user.count({})
                res.send({ message: `Hello world, this is the root page! We have ${count} users` })
            }
            // Response validation is also possible. Example:
            /*
            function (req: Request, res: Response & { validateResponse: any }) {
                const response = {
                    message: 200 // number, despite OpenAPI specifying string
                }
                const validationError = res.validateResponse(200, response);
                if (validationError) {
                    // Must explicitly throw error!
                    throw validationError
                }
                res.status(200).send(response)
            }
            */
        ],
        getUser: [
            async function (req: Request, res: Response) {
                let count = await db.user.count({})
                res.send({ message: `Hello world, this ${req.query.name}'s page! We have ${count} users` })
            }
        ]
    },
    // errorMiddleware handles validation errors in Request object, e.g. missing params
    errorMiddleware: (err, req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500).json(err)
    }
})
