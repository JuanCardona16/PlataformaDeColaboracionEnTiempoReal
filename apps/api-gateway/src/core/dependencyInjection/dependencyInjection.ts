import { TOKEN_SECRET } from "@/constants/env/index.js";
import dbInstance from "@/infraestructure/mongodb/config/index.js";
import { AuthServices } from "@repo/domain/auth";
import { ProfileServices, IUserRepository } from "@repo/domain/user";
import { UserMongoRepository } from "@repo/infraestructure/mongodb";
import { BcryptHashingService, IHashingService } from "@repo/security/hashing";
import { ItokenService, JwtTokenService } from "@repo/security/jsonwebtoken";

export interface IDependencyInjection {
  authServices: AuthServices;
  tokenService: ItokenService;
  profileServices: ProfileServices;
}

export async function initializeDependencyInjection() {
  // 1. CONEXIÓN A INFRAESTRUCTURA
  await dbInstance.connect();

  const repositories = {
    userRepository: new UserMongoRepository() as IUserRepository,
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


  return {
    authServices,
    tokenService: utilityServices.tokenService,
    profileServices,
  };
}
