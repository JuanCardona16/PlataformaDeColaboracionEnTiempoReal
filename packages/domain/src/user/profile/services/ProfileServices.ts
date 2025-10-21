import { IUpdateUserProps } from "@repo/shared/types/index.js";
import { IUserRepository } from "../../repository/IUserRepository.js";

export class ProfileServices {
  constructor(private userRepository: IUserRepository) {}

  public async getUserInfoById(uuid: string) {
    if (!uuid) throw new Error("Invalid data");
    return await this.userRepository.findUserById(uuid);
  }

  public async updateUser(uuid: string, data: IUpdateUserProps) {
    if (!uuid || !data) throw new Error("Invalid data");
    return await this.userRepository.updateUser(uuid, data);
  }

  public async deleteUser(uuid: string) {
    if (!uuid) throw new Error("Invalid data");
    return await this.userRepository.deleteUser(uuid);
  }

}
