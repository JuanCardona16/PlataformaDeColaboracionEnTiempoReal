// =======================
// SALA COLABORATIVA COMPLETA
// =======================
export interface ICollaborativeRoom {
  uuid: string;
  name: string;
  description?: string;
  ownerId: string;
  participants: IRoomParticipant[];
  settings: IRoomSettings;
  status: "active" | "ended" | "archived";
  features?: {
    chat?: boolean;
    voting?: boolean;
    whiteboard?: boolean;
    screenShare?: boolean;
  };
  voteOptions?: IRoomVoteOption[];
  votes?: IUserVote[];
  chat?: IChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;

  // Nuevos campos
  accessCode?: string; // código que el usuario puede ingresar manualmente
  accessLink?: string; // link único
  linkAccess?: IRoomLinkAccess; // configuración de permisos del link
}

// Configuración del link de acceso
export interface IRoomLinkAccess {
  enabled: boolean; // si el link está activo o no
  permissions: ("view" | "chat" | "vote" | "edit" | "all")[];
  expiresAt?: Date;
}

// =======================
// PARTICIPANTES DE LA SALA
// =======================
export interface IRoomParticipant {
  userId: string;
  role: "admin" | "moderator" | "member" | "guest";
  joinedAt: Date;
  isActive: boolean;
  lastSeen?: Date;
}

// =======================
// CONFIGURACIÓN DE LA SALA
// =======================
export interface IRoomSettings {
  isPrivate: boolean;
  maxParticipants: number;
  allowChat: boolean;
  requireApprovalToJoin?: boolean;
}

// =======================
// MENSAJES DEL CHAT
// =======================
export interface IChatMessage {
  uuid: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "file" | "system";
  metadata?: Record<string, any>;
  createdAt: Date;
}

// =======================
// EVENTOS DE LA SALA
// =======================

// =======================
// OPCIONES DE VOTACIÓN
// =======================
export interface IRoomVoteOption {
  uuid: string;
  label: string;
}

/**
 * Voto emitido por un usuario dentro de la sala
 */
export interface IUserVote {
  userId: string;
  optionId: string;
  timestamp: Date;
}
