import {
  IChatMessage,
  ICollaborativeRoom,
  IUserVote,
} from "@repo/shared/types";
import { MongoQueriesGlobalGeneric } from "../../helpers/index.js";
import { IRoomRepository } from "@repo/domain/room"; // o IRoomRepository según tu estructura
import { RoomDocument, RoomModel } from "../../schemas/room/index.js";

export class RoomMongoRepository implements IRoomRepository {
  private readonly mongoQueries: MongoQueriesGlobalGeneric<RoomDocument>;

  constructor() {
    this.mongoQueries = new MongoQueriesGlobalGeneric<RoomDocument>(RoomModel);
  }

  // ======================
  // CRUD BÁSICO
  // ======================

  async exists(uuid: string): Promise<boolean> {
    const exists = await RoomModel.exists({ uuid });
    return !!exists;
  }

  async createRoom(
    data: Omit<ICollaborativeRoom, "createdAt" | "updatedAt">
  ): Promise<void> {
    const now = new Date();
    await this.mongoQueries.create<ICollaborativeRoom>({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateRoom(
    uuid: string,
    data: Partial<ICollaborativeRoom>
  ): Promise<ICollaborativeRoom | null> {
    return await this.mongoQueries.update<ICollaborativeRoom>(uuid, {
      ...data,
      updatedAt: new Date(),
    });
  }

  async deleteRoom(uuid: string): Promise<void> {
    await this.mongoQueries.delete(uuid);
  }

  async findUserById(uuid: string): Promise<ICollaborativeRoom | null> {
    return await this.mongoQueries.findByUuid<ICollaborativeRoom>(uuid);
  }

  // ======================
  // CONSULTAS
  // ======================

  async findAllRooms(): Promise<ICollaborativeRoom[]> {
    return await RoomModel.find().lean();
  }

  async findByOwnerId(ownerId: string): Promise<ICollaborativeRoom[]> {
    return await RoomModel.find({ ownerId }).lean();
  }

  async findByParticipantId(
    participantId: string
  ): Promise<ICollaborativeRoom[]> {
    return await RoomModel.find({
      "participants.userId": participantId,
    }).lean();
  }

  async findActiveRooms(): Promise<ICollaborativeRoom[]> {
    return await RoomModel.find({ status: "active" }).lean();
  }

  async findArchivedRooms(): Promise<ICollaborativeRoom[]> {
    return await RoomModel.find({ status: "archived" }).lean();
  }

  // ======================
  // PARTICIPANTES
  // ======================

  async addParticipant(roomId: string, userId: string): Promise<void> {
    const participant = {
      userId,
      role: "member",
      joinedAt: new Date(),
      isActive: true,
    };
    await RoomModel.updateOne(
      { uuid: roomId },
      { $push: { participants: participant }, $set: { updatedAt: new Date() } }
    );
  }

  async removeParticipant(roomId: string, userId: string): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $pull: { participants: { userId } }, $set: { updatedAt: new Date() } }
    );
  }

  async updateParticipantRole(
    roomId: string,
    userId: string,
    role: string
  ): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId, "participants.userId": userId },
      { $set: { "participants.$.role": role, updatedAt: new Date() } }
    );
  }

  async updateParticipantStatus(
    roomId: string,
    userId: string,
    isActive: boolean
  ): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId, "participants.userId": userId },
      { $set: { "participants.$.isActive": isActive, updatedAt: new Date() } }
    );
  }

  // ======================
  // CHAT / MENSAJES
  // ======================

  async addMessage(roomId: string, message: IChatMessage): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $push: { chat: message }, $set: { updatedAt: new Date() } }
    );
  }

  async clearChat(roomId: string): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $set: { chat: [], updatedAt: new Date() } }
    );
  }

  // ======================
  // VOTACIÓN
  // ======================

  async addVote(roomId: string, vote: IUserVote): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $push: { votes: vote }, $set: { updatedAt: new Date() } }
    );
  }

  async clearVotes(roomId: string): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $set: { votes: [], updatedAt: new Date() } }
    );
  }

  // ======================
  // CONFIGURACIÓN / ESTADO
  // ======================

  async updateSettings(
    roomId: string,
    settings: Partial<ICollaborativeRoom["settings"]>
  ): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $set: { settings, updatedAt: new Date() } }
    );
  }

  async changeStatus(
    roomId: string,
    status: "active" | "ended" | "archived"
  ): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $set: { status, updatedAt: new Date() } }
    );
  }

  // ======================
  // UTILIDADES
  // ======================

  async countParticipants(roomId: string): Promise<number> {
    const room = await RoomModel.findOne(
      { uuid: roomId },
      { participants: 1 }
    ).lean();
    return room?.participants?.length ?? 0;
  }

  async countRoomsByOwner(ownerId: string): Promise<number> {
    return await RoomModel.countDocuments({ ownerId });
  }

  // ======================
  // ACCESO A SALAS
  // ======================

  // Buscar una sala por código de acceso
  async findByAccessCode(code: string): Promise<ICollaborativeRoom | null> {
    return await RoomModel.findOne({ accessCode: code }).lean();
  }

  // Buscar una sala por link de acceso
  async findByAccessLink(link: string): Promise<ICollaborativeRoom | null> {
    return await RoomModel.findOne({ accessLink: link }).lean();
  }

  // Actualizar o generar nuevo código de acceso
  async updateAccessCode(roomId: string, code: string): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $set: { accessCode: code, updatedAt: new Date() } }
    );
  }

  // Configurar el link de acceso (activar, desactivar, permisos, expiración)
  async updateLinkAccess(
    roomId: string,
    config: ICollaborativeRoom["linkAccess"]
  ): Promise<void> {
    await RoomModel.updateOne(
      { uuid: roomId },
      { $set: { linkAccess: config, updatedAt: new Date() } }
    );
  }
}
