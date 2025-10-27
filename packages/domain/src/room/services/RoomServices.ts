import {
  ICollaborativeRoom,
  IChatMessage,
  IUserVote,
} from "@repo/shared/types/index.js";
import { IRoomRepository } from "../repository/IRoomRepository.js";
import { Room } from "../agregate/Room.js";

export class RoomService {
  constructor(private roomRepository: IRoomRepository) {}

  // =======================
  // CRUD PRINCIPAL
  // =======================
  public async createRoom(
    data: Omit<ICollaborativeRoom, "uuid" | "createdAt" | "updatedAt">
  ) {
    if (!data?.name || !data?.ownerId) {
      throw new Error("Invalid room data");
    }

    const newRoom = Room.create({
      ...data,
    });

    await this.roomRepository.createRoom(newRoom.getProps());
  }

  public async updateRoom(uuid: string, data: Partial<ICollaborativeRoom>) {
    if (!uuid || !data) throw new Error("Invalid data for update");
    return await this.roomRepository.updateRoom(uuid, data);
  }

  public async deleteRoom(uuid: string) {
    if (!uuid) throw new Error("Room ID is required");
    await this.roomRepository.deleteRoom(uuid);
  }

  public async getRoomById(uuid: string) {
    if (!uuid) throw new Error("Room ID is required");
    return await this.roomRepository.findUserById(uuid);
  }

  // =======================
  // CONSULTAS
  // =======================
  public async getAllRooms() {
    return await this.roomRepository.findAllRooms();
  }

  public async getRoomsByOwner(ownerId: string) {
    if (!ownerId) throw new Error("Owner ID is required");
    return await this.roomRepository.findByOwnerId(ownerId);
  }

  public async getRoomsByParticipant(userId: string) {
    if (!userId) throw new Error("Participant ID is required");
    return await this.roomRepository.findByParticipantId(userId);
  }

  public async getActiveRooms() {
    return await this.roomRepository.findActiveRooms();
  }

  public async getArchivedRooms() {
    return await this.roomRepository.findArchivedRooms();
  }

  // =======================
  // PARTICIPANTES
  // =======================
  public async addParticipant(roomId: string, userId: string) {
    if (!roomId || !userId) throw new Error("Missing data");
    await this.roomRepository.addParticipant(roomId, userId);
  }

  public async removeParticipant(roomId: string, userId: string) {
    if (!roomId || !userId) throw new Error("Missing data");
    await this.roomRepository.removeParticipant(roomId, userId);
  }

  public async changeParticipantRole(
    roomId: string,
    userId: string,
    role: string
  ) {
    if (!roomId || !userId || !role) throw new Error("Missing data");
    await this.roomRepository.updateParticipantRole(roomId, userId, role);
  }

  public async setParticipantActive(
    roomId: string,
    userId: string,
    isActive: boolean
  ) {
    if (!roomId || !userId) throw new Error("Missing data");
    await this.roomRepository.updateParticipantStatus(roomId, userId, isActive);
  }

  // =======================
  // CHAT
  // =======================
  public async sendMessage(roomId: string, message: IChatMessage) {
    if (!roomId || !message?.uuid || !message?.content)
      throw new Error("Invalid message");
    await this.roomRepository.addMessage(roomId, message);
  }

  public async clearChat(roomId: string) {
    if (!roomId) throw new Error("Room ID required");
    await this.roomRepository.clearChat(roomId);
  }

  // =======================
  // VOTACIÓN
  // =======================
  public async castVote(roomId: string, vote: IUserVote) {
    if (!roomId || !vote?.userId || !vote?.optionId)
      throw new Error("Invalid vote data");
    await this.roomRepository.addVote(roomId, vote);
  }

  public async resetVotes(roomId: string) {
    if (!roomId) throw new Error("Room ID required");
    await this.roomRepository.clearVotes(roomId);
  }

  // =======================
  // CONFIGURACIÓN / ESTADO
  // =======================
  public async updateSettings(
    roomId: string,
    settings: Partial<ICollaborativeRoom["settings"]>
  ) {
    if (!roomId || !settings) throw new Error("Invalid data");
    await this.roomRepository.updateSettings(roomId, settings);
  }

  public async changeStatus(
    roomId: string,
    status: "active" | "ended" | "archived"
  ) {
    if (!roomId || !status) throw new Error("Invalid data");
    await this.roomRepository.changeStatus(roomId, status);
  }

  // =======================
  // UTILIDADES
  // =======================
  public async countParticipants(roomId: string) {
    if (!roomId) throw new Error("Room ID required");
    return await this.roomRepository.countParticipants(roomId);
  }

  public async countRoomsByOwner(ownerId: string) {
    if (!ownerId) throw new Error("Owner ID required");
    return await this.roomRepository.countRoomsByOwner(ownerId);
  }

  // =======================
  // GENERAR / VALIDAR CÓDIGOS DE ACCESO
  // =======================
  public async generateAccessCode(roomId: string) {
    if (!roomId) throw new Error("Room ID is required");
    const code = Array.from({ length: 6 }, () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
        Math.floor(Math.random() * 36)
      )
    ).join(""); // example: "A7F4KZ"
    await this.roomRepository.updateAccessCode(roomId, code);
    return code;
  }

  public async joinByAccessCode(code: string, userId: string) {
    if (!code || !userId) throw new Error("Missing data");
    const room = await this.roomRepository.findByAccessCode(code);
    if (!room) throw new Error("Invalid access code");

    await this.roomRepository.addParticipant(room.uuid, userId);
    return room;
  }

  // =======================
  // LINK DE ACCESO
  // =======================
  public async generateAccessLink(roomId: string, baseUrl: string) {
    if (!roomId || !baseUrl) throw new Error("Missing data");
    const token = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const accessLink = `${baseUrl}/rooms/${roomId}?token=${token}`;
    const config = {
      enabled: true,
      permissions: ["view", "chat"] as ("view" | "chat" | "vote" | "edit" | "all")[],
    };
    await this.roomRepository.updateLinkAccess(roomId, config);
    await this.roomRepository.updateRoom(roomId, { accessLink });
    return accessLink;
  }

  public async joinByAccessLink(link: string, userId: string) {
    if (!link || !userId) throw new Error("Missing data");
    const room = await this.roomRepository.findByAccessLink(link);
    if (!room) throw new Error("Invalid access link");

    if (!room.linkAccess?.enabled) throw new Error("Access link disabled");
    if (
      room.linkAccess?.expiresAt &&
      new Date() > new Date(room.linkAccess.expiresAt)
    )
      throw new Error("Access link expired");

    await this.roomRepository.addParticipant(room.uuid, userId);
    return room;
  }

  public async updateLinkPermissions(
    roomId: string,
    permissions: ["view" | "chat" | "vote" | "edit"],
    expiresAt?: Date
  ) {
    if (!roomId) throw new Error("Missing room ID");
    await this.roomRepository.updateLinkAccess(roomId, {
      enabled: true,
      permissions,
      expiresAt,
    });
  }
}
