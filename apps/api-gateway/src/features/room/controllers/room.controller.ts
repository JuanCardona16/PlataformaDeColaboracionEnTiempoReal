import { Request, Response } from "express";
import { RoomService } from '@repo/domain/room'

export class RoomController {
  constructor(private roomService: RoomService) {}

  public async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, ownerId, settings, features } = req.body;

      console.log("Datos para crear la sala des de la api: ", req.body)

      await this.roomService.createRoom({
        name,
        description,
        ownerId,
        settings,
        features,
        status: "active",
        participants: [
          {
            userId: ownerId,
            role: "admin",
            joinedAt: new Date(),
            isActive: true,
            lastSeen: new Date(),
          },
        ],
        chat: [],
        votes: [],
      });
      res.status(201).json({ message: "Room created successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      const updates = req.body;

      const updatedRoom = await this.roomService.updateRoom(uuid!, updates);
      if (updatedRoom) {
        res.status(200).json(updatedRoom);
      } else {
        res.status(404).json({ message: "Room not found" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      await this.roomService.deleteRoom(uuid!);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { uuid } = req.params;
      const room = await this.roomService.getRoomById(uuid!);
      if (room) {
        res.status(200).json(room);
      } else {
        res.status(404).json({ message: "Room not found" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getAllRooms();
      res.status(200).json(rooms);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getRoomsByOwner(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.params;
      const rooms = await this.roomService.getRoomsByOwner(ownerId!);
      res.status(200).json(rooms);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getRoomsByParticipant(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const rooms = await this.roomService.getRoomsByParticipant(userId!);
      res.status(200).json(rooms);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getActiveRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getActiveRooms();
      res.status(200).json(rooms);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async getArchivedRooms(req: Request, res: Response): Promise<void> {
    try {
      const rooms = await this.roomService.getArchivedRooms();
      res.status(200).json(rooms);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async addParticipant(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, userId } = req.body;
      await this.roomService.addParticipant(roomId, userId);
      res.status(200).json({ message: "Participant added successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async removeParticipant(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, userId } = req.body;
      await this.roomService.removeParticipant(roomId, userId);
      res.status(200).json({ message: "Participant removed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async changeParticipantRole(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { roomId, userId, role } = req.body;
      await this.roomService.changeParticipantRole(roomId, userId, role);
      res
        .status(200)
        .json({ message: "Participant role updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async setParticipantActive(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { roomId, userId, isActive } = req.body;
      await this.roomService.setParticipantActive(roomId, userId, isActive);
      res
        .status(200)
        .json({ message: "Participant status updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, message } = req.body;
      await this.roomService.sendMessage(roomId, message);
      res.status(200).json({ message: "Message sent successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async clearChat(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      await this.roomService.clearChat(roomId!);
      res.status(200).json({ message: "Chat cleared successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async castVote(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, vote } = req.body;
      await this.roomService.castVote(roomId, vote);
      res.status(200).json({ message: "Vote cast successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async resetVotes(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      await this.roomService.resetVotes(roomId!);
      res.status(200).json({ message: "Votes reset successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const settings = req.body;
      await this.roomService.updateSettings(roomId!, settings);
      res.status(200).json({ message: "Room settings updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const { status } = req.body;
      await this.roomService.changeStatus(roomId!, status);
      res.status(200).json({ message: "Room status updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async countParticipants(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const count = await this.roomService.countParticipants(roomId!);
      res.status(200).json({ count });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async countRoomsByOwner(req: Request, res: Response): Promise<void> {
    try {
      const { ownerId } = req.params;
      const count = await this.roomService.countRoomsByOwner(ownerId!);
      res.status(200).json({ count });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // =======================
  // ACCESO POR CÓDIGO
  // =======================
  generateAccessCode = async (req: Request, res: Response) => {
    try {
      const { uuid } = req.params;
      const code = await this.roomService.generateAccessCode(uuid!);
      res.status(200).json({ message: "Access code generated", code });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  joinByAccessCode = async (req: Request, res: Response) => {
    try {
      const { code, userId } = req.body;
      const room = await this.roomService.joinByAccessCode(code, userId);
      res.status(200).json({ message: "User joined room", room });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  // =======================
  // ACCESO POR LINK
  // =======================
  generateAccessLink = async (req: Request, res: Response) => {
    try {
      const { uuid } = req.params;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const link = await this.roomService.generateAccessLink(uuid!, baseUrl);
      res.status(200).json({ message: "Access link generated", link });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  joinByAccessLink = async (req: Request, res: Response) => {
    try {
      const { link, userId } = req.body;
      const room = await this.roomService.joinByAccessLink(link, userId);
      res.status(200).json({ message: "User joined via link", room });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}