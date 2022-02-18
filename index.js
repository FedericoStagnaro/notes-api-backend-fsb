const app = require("./app")
const http = require("http")
const config = require("./utils/config")
const logger = require("./utils/logger")

const server = http.createServer(app)

const PORT = config.PORT || 3001
const appServer = server.listen(PORT, ()=> {
     logger.info(`Server running on PORT ${PORT}`)})

module.exports = appServer