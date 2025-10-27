import mongoose, { Document, Schema, Types } from "mongoose";
import { ICollaborativeRoom } from "@repo/shared/types";

export interface RoomDocument extends ICollaborativeRoom, Document {
  _id: Types.ObjectId;
}

const RoomSchema = new Schema<RoomDocument>(
  {
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: String, required: true },
    participants: [
      {
        userId: String,
        role: String,
        joinedAt: Date,
        isActive: Boolean,
        lastSeen: Date,
      },
    ],
    settings: {
      isPrivate: Boolean,
      maxParticipants: Number,
      allowChat: Boolean,
      requireApprovalToJoin: Boolean,
    },
    status: String,
    features: {
      chat: Boolean,
      voting: Boolean,
      whiteboard: Boolean,
      screenShare: Boolean,
    },
    voteOptions: [{ uuid: String, label: String }],
    votes: [{ userId: String, optionId: String, timestamp: Date }],
    chat: [
      {
        uuid: String,
        roomId: String,
        senderId: String,
        senderName: String,
        content: String,
        type: String,
        metadata: Schema.Types.Mixed,
        createdAt: Date,
      },
    ],
    accessCode: { type: String, unique: true },
    accessLink: { type: String },
    linkAccess: {
      enabled: { type: Boolean, default: false },
      permissions: [{ type: String }],
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const RoomModel = mongoose.model<
  RoomDocument,
  mongoose.Model<RoomDocument>
>("Room", RoomSchema);

