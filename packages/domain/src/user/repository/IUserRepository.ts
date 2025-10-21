import { IUpdateUserProps, IUser } from "@repo/shared/types"

export interface IUserRepository {
  exists(uuid: string): Promise<boolean>
  createUser(data: IUser): Promise<void>
  updateUser(uuid: string, data: IUpdateUserProps): Promise<IUser | null>
  deleteUser(uuid: string): Promise<void>
  findUserById(uuid: string): Promise<IUser | null>
  findUserByEmail(email: string): Promise<IUser | null>
}