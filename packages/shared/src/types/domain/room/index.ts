// =======================
// PARTICIPANTES DE LA SALA
// =======================
export interface IRoomParticipant {
  /**
   * Identificador único del usuario (UUID)
   */
  userId: string;

  /**
   * Rol dentro de la sala:
   * - admin → creador o dueño
   * - moderator → puede controlar chat o expulsar
   * - member → participante normal
   * - guest → usuario invitado sin permisos
   */
  role: "admin" | "moderator" | "member" | "guest";

  /**
   * Fecha/hora en que el usuario se unió a la sala
   */
  joinedAt: Date;

  /**
   * Si el usuario está conectado actualmente (presencia en tiempo real)
   */
  isActive: boolean;

  /**
   * Última vez que se detectó al usuario activo (para métricas o reconexiones)
   */
  lastSeen?: Date;
}

// =======================
// CONFIGURACIÓN DE LA SALA
// =======================
export interface IRoomSettings {
  /**
   * Si la sala es privada (solo usuarios autorizados pueden entrar)
   */
  isPrivate: boolean;

  /**
   * Máximo número de participantes permitidos
   */
  maxParticipants: number;

  /**
   * Permite habilitar o deshabilitar el chat dentro de la sala
   */
  allowChat: boolean;

  /**
   * Permite el envío de archivos
   */
  allowFileShare: boolean;

  /**
   * Si permite transmisión de video
   */
  allowVideo?: boolean;

  /**
   * Si permite comunicación por voz
   */
  allowVoice?: boolean;

  /**
   * Si requiere aprobación del admin antes de que un usuario pueda unirse
   */
  requireApprovalToJoin?: boolean;

  /**
   * Si la reunión debe grabarse automáticamente (pensando a futuro)
   */
  autoRecord?: boolean;
}

// =======================
// MENSAJES DEL CHAT
// =======================
export interface IChatMessage {
  /**
   * Identificador único del mensaje
   */
  uuid: string;

  /**
   * ID de la sala a la que pertenece el mensaje
   */
  roomId: string;

  /**
   * ID del usuario que envió el mensaje
   */
  senderId: string;

  /**
   * Nombre visible del remitente
   */
  senderName: string;

  /**
   * Contenido del mensaje (texto o descripción de archivo)
   */
  content: string;

  /**
   * Tipo de mensaje:
   * - text → texto normal
   * - file → archivo o documento
   * - system → notificación del sistema (ej. “Juan se unió”)
   */
  type: "text" | "file" | "system";

  /**
   * Datos extra (ej. URL del archivo, reacciones, estado editado)
   */
  metadata?: Record<string, any>;

  /**
   * Momento en que se envió el mensaje
   */
  createdAt: Date;
}

// =======================
// EVENTOS DE LA SALA
// =======================
export interface IRoomEvent<T = any> {
  /**
   * Identificador único del evento
   */
  eventId: string;

  /**
   * Sala en la que ocurre el evento
   */
  roomId: string;

  /**
   * Tipo de evento registrado:
   * - user_joined → alguien entra
   * - user_left → alguien sale
   * - message_sent → se envía mensaje
   * - room_created → se crea la sala
   * - room_closed → la sala termina
   * - vote_casted → usuario vota
   * - settings_updated → se modifica configuración
   */
  type:
    | "user_joined"
    | "user_left"
    | "message_sent"
    | "room_created"
    | "room_closed"
    | "vote_casted"
    | "settings_updated";

  /**
   * Usuario que generó el evento (opcional, algunos eventos son globales)
   */
  userId?: string;

  /**
   * Datos adicionales relacionados con el evento (mensaje, voto, etc.)
   */
  data?: T;

  /**
   * Fecha y hora en que ocurrió el evento
   */
  timestamp: Date;
}

// =======================
// OPCIONES DE VOTACIÓN
// =======================
export interface IRoomVoteOption {
  /**
   * ID único de la opción de votación
   */
  id: string;

  /**
   * Texto visible de la opción (ej. “A favor”, “En contra”)
   */
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

// =======================
// SALA COLABORATIVA COMPLETA
// =======================
export interface ICollaborativeRoom {
  /**
   * Identificador único de la sala
   */
  uuid: string;

  /**
   * Nombre de la sala (título o tema principal)
   */
  name: string;

  /**
   * Descripción breve de la reunión o sala
   */
  description?: string;

  /**
   * ID del usuario que creó la sala (owner)
   */
  ownerId: string;

  /**
   * Lista de participantes activos o registrados
   */
  participants: IRoomParticipant[];

  /**
   * Configuración de la sala (privacidad, chat, video, etc.)
   */
  settings: IRoomSettings;

  /**
   * Estado actual de la sala:
   * - active → en curso
   * - ended → finalizada
   * - archived → almacenada o inactiva
   */
  status: "active" | "ended" | "archived";

  /**
   * Módulos o funcionalidades activas en la sala (puede crecer con el tiempo)
   */
  features?: {
    chat?: boolean;
    voting?: boolean;
    whiteboard?: boolean;
    screenShare?: boolean;
  };

  /**
   * Opciones disponibles si la sala tiene votaciones
   */
  voteOptions?: IRoomVoteOption[];

  /**
   * Votos realizados por los usuarios
   */
  votes?: IUserVote[];

  /**
   * Historial del chat (mensajes enviados)
   */
  chat?: IChatMessage[];

  /**
   * Registro de eventos ocurridos dentro de la sala
   */
  events?: IRoomEvent[];

  /**
   * Fecha de creación de la sala
   */
  createdAt: Date;

  /**
   * Última vez que se actualizó la sala
   */
  updatedAt: Date;
}
