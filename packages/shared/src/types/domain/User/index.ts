export interface IUser {
  uuid: string;
  passwordHash: string;
  profile: {
    username: string;
    email: string;
    friends: string[];
  };
  settings: {
    isVerified: boolean;
    isActive: boolean;
  };
}

// Types Globals
type IUserWithoutUuidProp = Omit<IUser, "uuid">;

// User services Types
export type ICraeteUserProps = Omit<IUser, "uuid" | "settings">;
export type IUpdateUserProps = Partial<IUser>;

// Mongo User Types
export type IUserMongoSchema = IUser & {
  createdAt: Date;
  updateAt: Date;
};

export type IUserMongoCreateSchemaProps = IUserWithoutUuidProp;
