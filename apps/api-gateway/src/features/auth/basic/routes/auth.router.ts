import { IDependencyInjection } from "@/core/dependencyInjection/dependencyInjection.js";
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { asyncHandler } from "@/core/errors/middleware/errorHandler.js";

export default (container: IDependencyInjection): Router => {
  const authRouter = Router();

  const authController = new AuthController(
    container.authServices
  );

  authRouter.post(
    "/login",
    asyncHandler(authController.login.bind(authController))
  );
  authRouter.post(
    "/register",
    asyncHandler(authController.register.bind(authController))
  );

  return authRouter;
};
