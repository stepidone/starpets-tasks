import { CronJob } from "cron";
import { JobModel } from "../database/entities/job.entity";
import { JobLogModel } from "../database/entities/logs.entity";
import { isValidCron } from "cron-validator";
import { Sequelize } from "sequelize-typescript";

type JobListDto = {
  [key: string]: () => Promise<unknown> | unknown;
};

function sleep(ms = 120000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class WorkerModel {
  private static jobList: JobListDto = {};

  private static pid = process.pid;

  constructor() {}

  private static mockHandler() {
    const ms = 1000 * 60 * 2; // 2 minutes
    return sleep(ms);
  }

  private static async onTick() {
    const [, [job]] = await JobModel.update(
      {
        onUseBy: this.pid,
      },
      {
        returning: true,
        where: {
          name: Sequelize.literal(`
            "name" = (select "name" from "Jobs"
            where "onUseBy" is null
            limit 1)
          `),
        },
      },
    );
    if (!job) return;

    const isCronValid = isValidCron(job.cron, { seconds: true });
    if (!isCronValid) return job.destroy();

    const cron = new CronJob(job.cron, async () => {
      const handler = this.jobList[job.name] || this.mockHandler;
      const log = await JobLogModel.create({
        jobName: job.name,
        runnedAt: new Date(),
        runnedBy: this.pid,
      });
      await handler();
      await log.update({
        completedAt: new Date(),
      });
    });
    cron.start();
  }

  public static async start() {
    const cron = new CronJob("*/5 * * * * *", () => this.onTick());
    cron.start();
  }
}
