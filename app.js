
const express = require("express");
const bodyParser = require("body-parser");
const { map } = require("lodash");

const host = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_SCHEMA;

console.log("configurations ",{
  host,
  dbPort,
  user,
  password,
  database
})
const { connect, disconnect } = require("./src/database/pool");
const errorMiddleware = require("./src/middlewares/error");
const traceIdMiddleware = require("./src/middlewares/traceId");

const notFoundRoute = require("./src/middlewares/notFound");
const healthCheckRouter = require("./src/routes/healthCheck");
const videoRouter = require("./src/routes");



const createApp = () => {
  const app = express();
  app.use(traceIdMiddleware);
  app.use(bodyParser.json());

  const routes = {
    "/health": healthCheckRouter,
    "/video": videoRouter,
  };

  map(routes, (router, route) => app.use(route, router));

  app.use(notFoundRoute);
  app.use(errorMiddleware);

  return app;
};

const start = (port = 3000) => {
  const app = createApp();

  return new Promise(async (resolve) => {
    const server = app.listen(port, () => {
      connect({ host, port: dbPort, user, password, database });
      const close = () => new Promise((resolve) => server.close(resolve));
      resolve({ close });
    });

    server.on("close", () => {
      disconnect();
    });
  });
};

module.exports = start;
