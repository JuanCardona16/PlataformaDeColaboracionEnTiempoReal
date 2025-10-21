import { Request, Response } from "express";
import { AuthServices } from "@repo/domain/auth";

export class AuthController {
  constructor(
    private authService: AuthServices,
  ) {}

  public async register(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    const token = await this.authService.register(
      username as string,
      email as string,
      password as string
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const token = await this.authService.login(
      email as string,
      password as string
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  }
}
