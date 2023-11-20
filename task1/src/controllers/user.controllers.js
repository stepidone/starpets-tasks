const { Router } = require('express')
const { UserModel } = require("../database/user.entity");
const { updateUserBalanceSchema } = require('./user.schemas')

const router = Router();

router.put('/balance', (req, res) => {
  const validationResult = updateUserBalanceSchema.validate(req.body)
  if (validationResult.error) return res.status(400).send(validationResult.error.message)
  const { userId, amount } = validationResult.value

  UserModel.increment('balance', {
    by: amount,
    where: {
      id: userId,
    },
  }).then(([[[user]]]) => {
    if (!user) return res.status(404).send('User not found')
    return res.send(user)
  }).catch((err) => {
    if (err.message.includes('users_check_is_balance_positive')) return res.status(403).send('Balance is too low')
    console.error(err)
    return res.status(500).send('Internal server error')
  })
})

module.exports = { router }
