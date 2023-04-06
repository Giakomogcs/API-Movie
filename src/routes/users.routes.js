const {Router} = require("express");
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const uploadConfig = require("../configs/upload")

const ensureAuthenticated = require("../middleware/ensureAuthenticated")
const multer = require("multer")

const usersRoutes = Router();
const Upload = multer(uploadConfig.MULTER)

const usersController = new UsersController();
const userAvatarController = new UserAvatarController()

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update)

usersRoutes.patch("/avatar", ensureAuthenticated, Upload.single("avatar"), userAvatarController.update)

module.exports = usersRoutes;