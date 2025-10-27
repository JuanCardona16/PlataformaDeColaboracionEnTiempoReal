import { Room } from "@repo/domain/room";
import { ICollaborativeRoom } from "@repo/shared/types";
import { RoomDocument } from "../../schemas/room/index.js";

export class RoomMapper {
  /**
   * Convierte un documento de MongoDB en una entidad de dominio Room
   */
  public static toDomain(document: RoomDocument | null): Room | null {
    if (!document) return null;

    // Convertimos el documento a un objeto plano compatible con la entidad
    const plain: ICollaborativeRoom = {
      uuid: document.uuid,
      name: document.name,
      description: document.description,
      ownerId: document.ownerId,
      participants:
        document.participants?.map((p: any) => ({
          userId: p.userId,
          role: p.role,
          joinedAt: new Date(p.joinedAt),
          isActive: p.isActive,
          lastSeen: p.lastSeen ? new Date(p.lastSeen) : undefined,
        })) ?? [],
      settings: {
        isPrivate: document.settings?.isPrivate ?? false,
        maxParticipants: document.settings?.maxParticipants ?? 10,
        allowChat: document.settings?.allowChat ?? true,
        requireApprovalToJoin:
          document.settings?.requireApprovalToJoin ?? false,
      },
      status: document.status ?? "active",
      features: document.features ?? { chat: true },
      voteOptions: document.voteOptions ?? [],
      votes: document.votes ?? [],
      chat: document.chat ?? [],
      createdAt: document.createdAt ? new Date(document.createdAt) : new Date(),
      updatedAt: document.updatedAt ? new Date(document.updatedAt) : new Date(),
    };

    return Room.fromPersistence(plain);
  }

  /**
   * Convierte una entidad de dominio Room en un objeto listo para persistir en MongoDB
   */
  public static toPersistence(entity: Room): Partial<RoomDocument> {
    const props = entity.getProps();

    return {
      uuid: props.uuid,
      name: props.name,
      description: props.description,
      ownerId: props.ownerId,
      participants: props.participants.map((p: any) => ({
        userId: p.userId,
        role: p.role,
        joinedAt: p.joinedAt,
        isActive: p.isActive,
        lastSeen: p.lastSeen,
      })),
      settings: {
        isPrivate: props.settings.isPrivate,
        maxParticipants: props.settings.maxParticipants,
        allowChat: props.settings.allowChat,
        requireApprovalToJoin: props.settings.requireApprovalToJoin,
      },
      status: props.status,
      features: props.features,
      voteOptions: props.voteOptions,
      votes: props.votes,
      chat: props.chat,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
