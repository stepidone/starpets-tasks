const Express = require('express');
const BodyParser = require('body-parser');
const Joi = require('joi')
const { Sequelize } = require('sequelize');
const { configurations } = require("./config");

/**
 * Server initialization
 */
const app = Express()
app.use(BodyParser.urlencoded({ extended: false }))

/**
 * Database initialization
 */
const { dbUrl } = configurations
const sequelize = new Sequelize(dbUrl, {
  logging: false,
})

/**
 * User entity definition
 */
const UserModel = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
  },
  balance: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'Users',
  timestamps: false,
});

/**
 * Update user balance route definition
 */
const updateUserBalanceSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  amount: Joi.number().integer().required(),
})

app.put('/api/user/balance', (req, res) => {
  const validationResult = updateUserBalanceSchema.validate(req.body)
  if (validationResult.error) return res.status(400).send(validationResult.error.message)
  const { userId, amount } = validationResult.value
  UserModel.findByPk(userId).then((user) => {
    if (!user) return res.status(404).send('User not found')
    if (amount < 0 && user.balance < amount) return res.status(403).send('Balance is too low')
    user.increment('balance', { by: amount }).then((updatedUser) => {
      return res.send(updatedUser.get({ plain: true }))
    }).catch((err) => {
      if (err.message.includes('users_check_is_balance_positive')) return res.status(403).send('Balance is too low')
      console.error(err)
      return res.status(500).send('Internal server error')
    })
  })
})

/**
 * Starting the server
 */
const { host, port } = configurations.server
app.listen(port, host, () => {
  console.info(`Server is running at http://${host}:${port}`);
})