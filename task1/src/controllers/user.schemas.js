const Joi = require('joi')

const updateUserBalanceSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  amount: Joi.number().integer().required(),
})

module.exports = { updateUserBalanceSchema }
