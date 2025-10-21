import { IDependencyInjection } from "@/core/dependencyInjection/dependencyInjection.js";
import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller.js";

export default (container: IDependencyInjection): Router => {
  const profileRouter = Router();

  const profileController = new ProfileController(container.profileServices);

  profileRouter.get(
    "/",
    profileController.getProfileByUserId.bind(profileController)
  );
  profileRouter.delete(
    "/:userId",
    profileController.deleteProfile.bind(profileController)
  );
  profileRouter.put(
    "/:userId",
    profileController.updateProfile.bind(profileController)
  );

  return profileRouter;
};
