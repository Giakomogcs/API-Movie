const {Router} = require("express")

const usersRouter = require("./users.routes")
const movesRouter = require("./moves.routes")
const tagsRouter = require("./tags.routes")
const sessionsRoutes = require("./sessions.routes");

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/moves", movesRouter)
routes.use("/tags", tagsRouter)
routes.use("/sessions", sessionsRoutes);

module.exports = routes