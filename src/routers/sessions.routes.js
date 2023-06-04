const { Router } = require("express");

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();

const SessionsRouter = Router();
SessionsRouter.post('/', sessionsController.create);

module.exports = SessionsRouter;