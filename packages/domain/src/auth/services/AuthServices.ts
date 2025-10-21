import { IUserRepository, User } from "../../user/index.js";
import { IHashingService } from "@repo/security/hashing";
import { ItokenService } from "@repo/security/jsonwebtoken";
import crypto from "node:crypto";

export class AuthServices {
  constructor(
    private userRepository: IUserRepository,
    private hashingService: IHashingService,
    private tokenService: ItokenService
  ) {}

  public async register(username: string, email: string, password: string) {
    const exists = await this.userRepository.findUserByEmail(email);
    if (exists) throw new Error("Email already registered");

    const hashingPassword = this.hashingService.hashPassword(password);
    const uuid = crypto.randomUUID();

    const newUser = User.craete({
      uuid,
      passwordHash: (await hashingPassword).toString(),
      profile: {
        username,
        email,
        friends: [],
      },
      settings: {
        isVerified: false,
        isActive: true,
      },
    });

    await this.userRepository.createUser(newUser.getProps());

    const token = this.tokenService.generateToken(
      {
        userId: newUser.getProps().uuid,
      },
      "1d"
    );

    return token;
  }

  public async login(email: string, password: string) {
    const exists = await this.userRepository.findUserByEmail(email);
    if (!exists) throw new Error("Invalid User");

    const isCorrectPassword = await this.hashingService.comparePassword(
      password,
      exists.passwordHash
    );
    if (!isCorrectPassword) throw new Error("Invalid Credentials");

    const token = this.tokenService.generateToken(
      {
        userId: exists.uuid,
      },
      "1d"
    );

    return token;
  }
}
