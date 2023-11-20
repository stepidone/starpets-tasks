import { Router } from "express";
import Joi from "joi";
import { JobLogModel } from "../database/entities/logs.entity";

const router = Router();

const getUserBalanceSchema = Joi.object({
  offset: Joi.number().integer().positive().optional().default(0),
  limit: Joi.number().integer().positive().optional().default(10),
  order: Joi.object({})
    .pattern(
      Joi.string().valid("runnedAt", "completedAt", "jobName"),
      Joi.string().valid("ASC", "DESC"),
    )
    .optional()
    .default({ runnedAt: "DESC" }),
});

router.get("", async (req, res) => {
  const validationResult = getUserBalanceSchema.validate(req.body);
  if (validationResult.error)
    return res.status(400).send(validationResult.error.message);
  const { offset, limit, order: orderRaw } = validationResult.value;

  const jobs = await JobLogModel.findAll({
    order: Object.entries(orderRaw).map(([key, value]) => [
      key,
      value as "ASC" | "DESC",
    ]),
    offset,
    limit,
    raw: true,
  });

  return res.status(200).send(jobs);
});

export default router;
