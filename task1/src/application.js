const Express = require('express');
const { configurations } = require("./config/config");
const { router: userRouter } = require('./controllers/user.controllers')

/**
 * Server initialization
 */
const app = Express()
app.use(Express.json())
app.use('/api/user', userRouter)

/**
 * Starting the server
 */
const { host, port } = configurations.server
app.listen(port, host, () => {
  console.info(`Server is running at http://${host}:${port}`);
})
