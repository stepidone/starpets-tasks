const Joi = require('joi')

const getLogsSchema = Joi.object({
  offset: Joi.number().integer().positive().optional().default(0),
  limit: Joi.number().integer().positive().max(100).optional().default(10),
  jobName: Joi.string().max(255).optional(),
  runnedBy: Joi.number().integer().positive().optional(),
  order: Joi.object({})
    .pattern(
      Joi.string().valid("id", "runnedAt", "completedAt"),
      Joi.string().valid("ASC", "DESC"),
    )
    .optional()
    .default({ id: "DESC" }),
});

module.exports = { getLogsSchema }
