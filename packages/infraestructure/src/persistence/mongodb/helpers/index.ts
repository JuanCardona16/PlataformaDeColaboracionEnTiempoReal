import { Model } from "mongoose";

export interface IMongoQueriesGlobalGeneric {
  create<T>(data: T): Promise<void>;
  update<T>(uuid: string, data: Partial<T>): Promise<T | null>;
  findByUuid<T>(uuid: string): Promise<T | null>;
  delete(uuid: string): Promise<void>;
}

export class MongoQueriesGlobalGeneric<T>
  implements IMongoQueriesGlobalGeneric
{
  private readonly MongoModel: Model<T>;

  constructor(MongoModelProps: Model<T>) {
    this.MongoModel = MongoModelProps;
  }

  async create<T>(data: T): Promise<void> {
    try {
      await this.MongoModel.create(data);
    } catch (error: unknown) {
      throw new Error(`Error creating document. Details: ${error}`);
    }
  }

  async update<T>(uuid: string, data: Partial<T>): Promise<T | null> {
    try {
      const flattened = this.flattenObject(data as Record<string, any>);

      const response = await this.MongoModel.findOneAndUpdate(
        { uuid },
        { $set: flattened },
        { new: true, runValidators: true }
      )
        .select("-_id -createdAt -passwordHash")
        .lean()
        .exec();
      
      return (response as T) || null;
    } catch (error: unknown) {
      throw new Error(`Error updating document. Details: ${error}`);
    }
  }

  async findByUuid<T>(uuid: string): Promise<T | null> {
    try {
      const response = await this.MongoModel.findOne({ uuid: uuid })
        .select("-createdAt -updatedAt -_id -passwordHash")
        .lean()
        .exec();
      return (response as T) || null;
    } catch (error: unknown) {
      throw new Error(`Error finding document by uuid. Details: ${error}`);
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      await this.MongoModel.deleteOne({ uuid: uuid });
    } catch (error: unknown) {
      throw new Error(`Error deleting document. Details: ${error}`);
    }
  }

  private flattenObject(obj: Record<string, any>, prefix = ""): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(acc, this.flattenObject(value, newKey));
      } else {
        acc[newKey] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  }
}
