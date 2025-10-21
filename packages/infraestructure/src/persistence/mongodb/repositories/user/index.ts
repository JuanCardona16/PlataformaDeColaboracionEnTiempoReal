import { IUserRepository } from "@repo/domain/user";
import { MongoQueriesGlobalGeneric } from "../../helpers/index.js";
import { UserModel } from "../../schemas/index.js";
import { IUpdateUserProps, IUser } from "@repo/shared/types";

export class UserMongoRepository implements IUserRepository {
  private readonly mongoQueries: MongoQueriesGlobalGeneric<IUser>;

  constructor() {
    this.mongoQueries = new MongoQueriesGlobalGeneric<IUser>(UserModel);
  }

  async createUser(data: IUser) {
    await this.mongoQueries.create<IUser>(data);
  }

  async updateUser(
    uuid: string,
    user: IUpdateUserProps
  ): Promise<IUser | null> {
    return await this.mongoQueries.update<IUser>(uuid, user);
  }

  async findUserById(uuid: string): Promise<IUser | null> {
    return await this.mongoQueries.findByUuid<IUser>(uuid);
  }

  async deleteUser(uuid: string): Promise<void> {
    await this.mongoQueries.delete(uuid);
  }

  // Puedes añadir métodos específicos del repositorio de usuario aquí
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ "profile.email": email })
      .select("-_id -createdAt -updatedAt")
      .lean();
  }

  async exists(userId: string): Promise<boolean> {
    const exists = await UserModel.exists({ uuid: userId });
    if (exists !== null) return true;
    return false;
  }

}
