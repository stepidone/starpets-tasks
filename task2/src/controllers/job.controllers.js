const { Router } = require('express')
const { LogModel } = require('../database/log.entity');
const { getLogsSchema } = require('./job.schema');

const router = Router();

router.get('', (req, res) => {
  const validationResult = getLogsSchema.validate(req.query);
  if (validationResult.error)
    return res.status(400).send(validationResult.error.message);
  const { offset, limit, jobName, runnedBy, order: orderRaw } = validationResult.value;

  LogModel.findAll({
    where: {
      ...(runnedBy && { runnedBy }),
      ...(jobName && { jobName }),
    },
    order: Object.entries(orderRaw).map(([key, value]) => [
      key,
      value,
    ]),
    offset,
    limit,
    raw: true,
  }).then((jobs) => {
    return res.status(200).send({
      currentApplicationPid: process.pid,
      jobs,
    });
  });
})

module.exports = { router }
