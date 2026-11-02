# Express + TypeScript + Prisma boilerplate

Requires **Node >=26.12.1** (and npm >=10.5.0), enforced via `engines` in `package.json`.

Before first run, generate the Prisma Client:

```sh
npx prisma generate
```

Copy `.env.example` to `.env` and fill in the values.

## Scripts

- `npm run dev` - start in watch mode with `nodemon` (TypeScript, no build step)
- `npm run build` - compile TypeScript to `dist/`
- `npm start` - build, then run `dist/index.js` with env vars loaded from `.env` via Node `--env-file`

Initial DB type is SQLite. Change it in `prisma/schema.prisma`.

## Prisma Studio
You can inspect the database visually with the GUI provided by Prisma Studio.

Simply run `npx prisma studio` and navigate to `localhost:5555`.

## Running a DB migration
Create an initial migration with `npx prisma migrate dev --name init`

What this does (according to [Prisma Docs](prisma.io/docs/getting-started/quickstart)):

- Creates SQL migration
- Executes migration, creating SQLite database `prisma/dev.db`
- Runs `prisma generate` to create a tailored Prisma Client API

## JWTs
Handle JWTs with middleware.

## Lightning Network
Uses Alex Bosworth's ["Lightning Methods"](https://www.npmjs.com/package/lightning) for TypeScript compatible Lnd Grpc API.

## Dotenv
From Node v20.6.0, dotenv is included in Node itself via `node --env-file=.env index.js`.

This repository enforces node version >=26.12.1.

Nodemon can also be replaced in Node v22, but we use it anyway because Linux support for `--watch` is not official.

## OpenAPI integration
API Docs can be accessed via the endpoint `/api-docs`.

Currently, we define an OpenAPI specification in `openapi.json` which is loaded in the `initialize()` function in `index.ts`.

It is also possible to define paths by directory structure!

In this case, create a `paths` directory, and place files like so:

```
paths/
    users/
        {id}.ts
    posts/
        {id}.ts
```

Each {id}.ts file implements an operation, an example provided here:

```
import { Operation } from 'express-openapi'

export const GET: Operation = [
    (req, res, _next) => {
        // do something
    }
]

GET.apiDoc = {
    summary: "User ID API",
    description: "lorem ipsum",
    operationId: "getUserId",
    parameters: [
        {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" }
        }
    ],
    responses: {
        200: {
            description: "Success",
            content: {
                "application/json": {
                    schema: {
                        type: "obect",
                        required: ["id"],
                        properties: {
                            id: { type: "integer" }
                        }
                    }
                }
            }
        }
    }
}
```

Then in `initiazlize()`, instead of providing `operations`, provide the following:

```
paths: './paths',
routesGlob: '**/*.{ts,js}',
routesIndexFileRegExp: /(?:index)?\.[tj]s$/,
```