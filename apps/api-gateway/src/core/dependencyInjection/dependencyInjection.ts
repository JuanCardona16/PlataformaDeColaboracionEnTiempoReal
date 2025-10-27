import { TOKEN_SECRET } from "@/constants/env/index.js";
import dbInstance from "@/infraestructure/mongodb/config/index.js";
import { AuthServices } from "@repo/domain/auth";
import { ProfileServices, IUserRepository } from "@repo/domain/user";
import { RoomService, IRoomRepository } from "@repo/domain/room";
import { RoomMongoRepository, UserMongoRepository } from "@repo/infraestructure/mongodb";
import { BcryptHashingService, IHashingService } from "@repo/security/hashing";
import { ItokenService, JwtTokenService } from "@repo/security/jsonwebtoken";
import { RoomController } from "@/features/room/controllers/room.controller.js";

export interface IDependencyInjection {
  authServices: AuthServices;
  tokenService: ItokenService;
  profileServices: ProfileServices;
  roomService: RoomService;
  roomController: RoomController;
}

export async function initializeDependencyInjection() {
  // 1. CONEXIÓN A INFRAESTRUCTURA
  await dbInstance.connect();

  const repositories = {
    userRepository: new UserMongoRepository() as IUserRepository,
    roomRepository: new RoomMongoRepository() as IRoomRepository,
  };

  const utilityServices = {
    tokenService: new JwtTokenService(TOKEN_SECRET!) as ItokenService,
    hashingService: new BcryptHashingService() as IHashingService,
  };

  const authServices = new AuthServices(
    repositories.userRepository,
    utilityServices.hashingService,
    utilityServices.tokenService
  );
  const profileServices = new ProfileServices(repositories.userRepository);
  const roomService = new RoomService(repositories.roomRepository);
  const roomController = new RoomController(roomService);

  return {
    authServices,
    tokenService: utilityServices.tokenService,
    profileServices,
    roomService,
    roomController,
  };
}
