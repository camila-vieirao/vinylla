import { Router } from "express";
import { login } from "../controllers/AuthenticateUserController";
import { createUser } from "../controllers/UserController";

const publicRoutes = Router();

publicRoutes.post("/login", login);

publicRoutes.post("/users", createUser);

export { publicRoutes };
