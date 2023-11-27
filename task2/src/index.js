const Express = require("express");
const { configurations } = require("./config/config");
const { Worker } = require("./jobs/worker");
const { router: jobRouter } = require("./controllers/job.controllers");

/**
 * Server initialization
 */
const app = Express();
app.use(Express.json());
app.use('/api/job', jobRouter)

Worker.heartbeat()
const worker = new Worker()
worker.assignJobs()

/**
 * Starting the server
 */
const { host, port } = configurations.server;
app.listen(port, host, () => {
  console.info(`Server is running at http://${host}:${port}`);
});
