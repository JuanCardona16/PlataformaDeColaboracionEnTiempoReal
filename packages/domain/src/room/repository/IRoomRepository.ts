import { IChatMessage, ICollaborativeRoom, IUserVote } from "@repo/shared/types/index.js";

export interface IRoomRepository {
  exists(uuid: string): Promise<boolean>;
  createRoom(
    data: Omit<ICollaborativeRoom, "createdAt" | "updatedAt">
  ): Promise<void>;
  updateRoom(
    uuid: string,
    data: Partial<ICollaborativeRoom>
  ): Promise<ICollaborativeRoom | null>;
  deleteRoom(uuid: string): Promise<void>;
  findUserById(uuid: string): Promise<ICollaborativeRoom | null>;

  // Consultas
  findAllRooms(): Promise<ICollaborativeRoom[]>;
  findByOwnerId(ownerId: string): Promise<ICollaborativeRoom[]>;
  findByParticipantId(participantId: string): Promise<ICollaborativeRoom[]>;
  findActiveRooms(): Promise<ICollaborativeRoom[]>;
  findArchivedRooms(): Promise<ICollaborativeRoom[]>;

  // Participantes
  addParticipant(roomId: string, userId: string): Promise<void>;
  removeParticipant(roomId: string, userId: string): Promise<void>;
  updateParticipantRole(
    roomId: string,
    userId: string,
    role: string
  ): Promise<void>;
  updateParticipantStatus(
    roomId: string,
    userId: string,
    isActive: boolean
  ): Promise<void>;

  // ======================
  // CHAT / MENSAJES
  // ======================
  addMessage(roomId: string, message: IChatMessage): Promise<void>;
  clearChat(roomId: string): Promise<void>;

  // ======================
  // VOTACIÓN
  // ======================
  addVote(roomId: string, vote: IUserVote): Promise<void>;
  clearVotes(roomId: string): Promise<void>;

  // ======================
  // CONFIGURACIÓN / ESTADO
  // ======================
  updateSettings(
    roomId: string,
    settings: Partial<ICollaborativeRoom["settings"]>
  ): Promise<void>;
  changeStatus(
    roomId: string,
    status: "active" | "ended" | "archived"
  ): Promise<void>;

  // ======================
  // UTILIDADES
  // ======================
  countParticipants(roomId: string): Promise<number>;
  countRoomsByOwner(ownerId: string): Promise<number>;

  // ======================
  // ACCESO A SALAS
  // ======================

  // Buscar una sala por código de acceso
  findByAccessCode(code: string): Promise<ICollaborativeRoom | null>;

  // Buscar una sala por link de acceso
  findByAccessLink(link: string): Promise<ICollaborativeRoom | null>;

  // Actualizar o generar nuevo código de acceso
  updateAccessCode(roomId: string, code: string): Promise<void>;

  // Configurar el link de acceso (activar, desactivar, permisos, expiración)
  updateLinkAccess(
    roomId: string,
    config: ICollaborativeRoom["linkAccess"]
  ): Promise<void>;
}
