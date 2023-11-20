import Express from "express";
import BodyParser from "body-parser";
import config from "../config/server.config";
import { WorkerModel } from "../jobs/worker";
import { DatabaseModel } from "../database/database";
import jobRoutes from "../controllers/job.controller";

export default async function () {
  const app = Express();
  const { host, port } = config.server;
  app.use(BodyParser.urlencoded({ extended: false }));

  await DatabaseModel.init();

  app.use("/api/job", jobRoutes);

  WorkerModel.start();

  app.listen(port, host, () => {
    console.info(`Server is running at http://${host}:${port}`);
  });
  return app;
}
