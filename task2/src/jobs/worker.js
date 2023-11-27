const { Op } = require('sequelize')
const { ConnectionModel } = require("../database/connection.entity");
const { JobModel } = require("../database/job.entity");
const { sleep } = require("../utils/time");
const { sequelize } = require('../database/sequelize');
const { LogModel } = require('../database/log.entity');

class Worker {
  static pid = process.pid

  static heartbeatInterval = 1000 * 60 * 5 // five minuntes

  handleInterval = 1000 * 10 // ten seconds

  jobList = {}

  constructor() {}

  static heartbeat() {
    ConnectionModel.upsert({
      pid: this.pid,
      lastHeartbeat: new Date()
    })

    sleep(this.heartbeatInterval).then(() => {
      this.heartbeat()
    })
  }
  
  mockHandler() {
    const ms = 1000 * 60 * 2; // 2 minutes
    return sleep(ms);
  }

  handleJob(job) {
    LogModel.create({
      jobName: job.name,
      runnedAt: new Date(),
      runnedBy: Worker.pid,
    }).then((log) => {
      const subHandler = this.jobList[job.name] || this.mockHandler
      subHandler()
        .then(() => log.update({
          completedAt: new Date(),
        }))
        .catch((err) => {
          console.error(err)
        })
    })

    sleep(job.msInterval).then(() => this.handleJob(job))
  }

  assignJobs() {
    const currentTime = new Date()

    sequelize.transaction().then((transaction) => {
      JobModel.findOne({
        where: {
          [Op.or]: [
            {
              onUseBy: {
                [Op.is]: null,
              }
            },
            {
              '$connection.lastHeartbeat$': {
                [Op.lt]: new Date(currentTime.getTime() - (Worker.heartbeatInterval * 2)),
              },
            },
          ],
        },
        include: [
          {
            model: ConnectionModel,
            as: 'connection',
            required: false,
          },
        ],
        skipLocked: true,
        raw: true,
        transaction,
      })

        .then((job) => {
          if (!job) return transaction.commit().then(() => sleep(this.handleInterval).then(() => this.assignJobs()))

          JobModel.findByPk(job.name, {
            lock: true,
            skipLocked: true,
            transaction,
          })

            .then((lockedJob) => {
              if (!lockedJob) return transaction.commit().then(() => sleep().then(() => this.assignJobs()))
              lockedJob.update({
                onUseBy: Worker.pid,
              }, { transaction }).then(() => {
                transaction.commit().then(() => {
                  if (!job) return
                  this.handleJob(lockedJob.get({ plain: true }))
                  sleep().then(() => this.assignJobs())
                })
              })
            })
        })
    })
  }
}

module.exports = { Worker }
