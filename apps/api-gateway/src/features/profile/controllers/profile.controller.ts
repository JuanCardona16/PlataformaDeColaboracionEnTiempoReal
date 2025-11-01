import { Request, Response } from "express";
import { ProfileServices } from "@repo/domain/user";
import { IUpdateUserProps } from "@repo/shared/types";

export class ProfileController {
  constructor(private profileService: ProfileServices) {}

  public async getProfileByUserId(req: Request, res: Response): Promise<void> {
    const { userId } = (req as any).user;

    if (!userId) throw new Error("User ID not found");

    const profile = await this.profileService.getUserInfoById(userId!);

    if (!profile) throw new Error("Profile not found");

    res.status(200).json(profile);
  }

  public async deleteProfile(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    if (!userId) throw new Error("User ID not found");

    await this.profileService.deleteUser(userId!);

    res.status(204).send();
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const data = req.body as IUpdateUserProps;

    console.log("Informacion para actilizar al usuario con uuid: ", userId, " Y estos son los nuevos datos: ", data)

    if (!userId || !data)
      throw new Error("Missing required fields: userId or update data");

    const profile = await this.profileService.updateUser(userId!, data);

    if (!profile) throw new Error("Profile update failed: user not found");

    res.status(200).json(profile);
  }

  public async getUsersProfilesByIds(req: Request, res: Response): Promise<void> {
    const userIds = req.body as string[];

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new Error("Missing or invalid userIds in request body");
    }

    const profiles = await this.profileService.findUsersProfilesByIds(userIds);

    res.status(200).json(profiles);
  }
}
