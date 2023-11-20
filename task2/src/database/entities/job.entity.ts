import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { JobLogModel } from "./logs.entity";

type JobDto = {
  name: string;
  cron: string;
  onUseBy: number;
};

type CreateJobDto = JobDto;

@Table({
  tableName: "Jobs",
  timestamps: false,
})
export class JobModel extends Model<JobDto, CreateJobDto> implements JobDto {
  @PrimaryKey
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  cron: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  onUseBy: number;

  @HasMany(() => JobLogModel, "jobName")
  logs: JobLogModel[];
}
