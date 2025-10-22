import { IChatMessage, ICollaborativeRoom, IRoomParticipant, IUserVote } from "@repo/shared/types/index.js";
import crypto from "node:crypto";


export class Room {
  constructor(private roomProps: ICollaborativeRoom) {}

  public static create(
    data: Omit<ICollaborativeRoom, "uuid" | "createdAt" | "updatedAt">
  ) {
    return new Room({
      uuid: crypto.randomUUID(),
      ...data,
    });
  }

  public static fromPersistence(props: ICollaborativeRoom) {
    return new Room(props);
  }

  public getProps(): ICollaborativeRoom {
    return { ...this.roomProps };
  }

  // =======================
  // MÉTODOS DE DOMINIO
  // =======================

  public update(
    updates: Partial<Omit<ICollaborativeRoom, "uuid" | "ownerId" | "createdAt">>
  ) {
    if ("uuid" in updates || "ownerId" in updates || "createdAt" in updates)
      throw new Error("Cannot modify immutable room properties");

    this.roomProps = {
      ...this.roomProps,
      ...updates,
      updatedAt: new Date(),
    };
  }

  public addParticipant(participant: IRoomParticipant) {
    if (
      this.roomProps.participants.some((p) => p.userId === participant.userId)
    )
      throw new Error("User already in room");

    if (
      this.roomProps.participants.length >=
      this.roomProps.settings.maxParticipants
    )
      throw new Error("Room is full");

    this.roomProps.participants.push(participant);
    this.roomProps.updatedAt = new Date();
  }

  public removeParticipant(userId: string) {
    this.roomProps.participants = this.roomProps.participants.filter(
      (p) => p.userId !== userId
    );
    this.roomProps.updatedAt = new Date();
  }

  public addMessage(message: IChatMessage) {
    if (!this.roomProps.features?.chat) return;
    this.roomProps.chat = this.roomProps.chat || [];
    this.roomProps.chat.push(message);
    this.roomProps.updatedAt = new Date();
  }

  public addVote(vote: IUserVote) {
    if (!this.roomProps.features?.voting) return;
    this.roomProps.votes = this.roomProps.votes || [];
    this.roomProps.votes.push(vote);
    this.roomProps.updatedAt = new Date();
  }

  public changeStatus(status: "active" | "ended" | "archived") {
    this.roomProps.status = status;
    this.roomProps.updatedAt = new Date();
  }
}
