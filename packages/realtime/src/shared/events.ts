export const SOCKET_EVENTS = {
  // Conexión base
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  // Presencia
  USER_CONNECTED: "user_connected",
  USER_DISCONNECTED: "user_disconnected",
  GET_ONLINE_USERS: "get_online_users",

  // Chat privado
  PRIVATE_SEND: "private_send",
  PRIVATE_MESSAGE: "private_message",
  PRIVATE_HISTORY: "private_history",

  // Salas colaborativas
  JOIN_ROOM_CODE: "join_room_by_code",
  JOIN_ROOM_LINK: "join_room_by_link",
  ROOM_MESSAGE: "new_message",
  PARTICIPANTS_UPDATED: "participants_updated",
};
