const {Router} = require("express");

const MovesController = require("../controllers/MovesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated")

const movesRoutes = Router();

const movesController = new MovesController();

movesRoutes.use(ensureAuthenticated)
movesRoutes.get("/", movesController.index);
movesRoutes.post("/", movesController.create);
movesRoutes.get("/:id", movesController.show);
movesRoutes.delete("/:id", movesController.delete);


module.exports = movesRoutes;