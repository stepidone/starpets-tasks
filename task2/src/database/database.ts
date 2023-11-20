import { ModelCtor, Sequelize } from "sequelize-typescript";
import config from "../config/server.config";
import { JobModel } from "./entities/job.entity";
import { JobLogModel } from "./entities/logs.entity";

export class DatabaseModel {
  private static sequelize: Sequelize;

  static async init() {
    const { database: options } = config;
    const models: ModelCtor[] = [JobModel, JobLogModel];

    this.sequelize = new Sequelize({
      dialect: "postgres",
      ...options,
      logging: false,
      models,
    });

    await this.sequelize.sync();

    return this.sequelize;
  }

  static get() {
    return this.sequelize;
  }
}
