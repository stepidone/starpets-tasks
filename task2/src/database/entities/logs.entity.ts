import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { JobModel } from "./job.entity";

type JobLogDto = {
  id: number;
  jobName: string;
  runnedAt: Date;
  completedAt: Date;
  runnedBy: number;
};

type CreateJobLogDto = JobLogDto;

@Table({
  tableName: "JobLogs",
  timestamps: false,
})
export class JobLogModel
  extends Model<JobLogDto, CreateJobLogDto>
  implements JobLogDto
{
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => JobLogModel)
  @Column(DataType.STRING)
  jobName: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  runnedAt: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  completedAt: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  runnedBy: number;

  @BelongsTo(() => JobModel, "jobName")
  job: JobModel;
}
