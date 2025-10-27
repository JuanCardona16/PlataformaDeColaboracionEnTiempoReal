import { Server, Socket } from "socket.io";
import { verifySocketAuth } from "./SocketAuth.js";
import {
  registerPresenceHandlers,
  registerPrivateChatHandlers,
  registerRoomHandlers,
} from "../handlers/index.js";
import { OnlineUsersManager } from "../managers/OnlineUsersManager.js";

export class RealtimeServer {
  private io: Server;
  private onlineUsers = new OnlineUsersManager();
  private readonly secret: string;

  constructor(server: any, corsOrigin: string = "*", secret: string = "") {
    this.secret = secret;
    this.io = new Server(server, {
      cors: { origin: corsOrigin, methods: ["GET", "POST"] },
    });

    this.io.use((socket, next) => verifySocketAuth(socket, next, this.secret));
  }

  public initializeHandlers() {
    this.io.on("connection", (socket: Socket) => {
      registerPresenceHandlers(this.io, socket, this.onlineUsers);
      registerPrivateChatHandlers(this.io, socket, this.onlineUsers);
      registerRoomHandlers(this.io, socket);
    });

    console.log("✅ RealtimeServer initialized");
  }

  public getIO() {
    return this.io;
  }

  public getOnlineUsers() {
    return this.onlineUsers;
  }
}
