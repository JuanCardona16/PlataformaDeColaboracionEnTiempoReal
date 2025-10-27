import { Router } from "express";
import { RoomController } from "../controllers/room.controller.js";

export class RoomRouter {
  public router: Router;

  constructor(private roomController: RoomController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      this.roomController.createRoom.bind(this.roomController)
    );
    this.router.put(
      "/:uuid",
      this.roomController.updateRoom.bind(this.roomController)
    );
    this.router.delete(
      "/:uuid",
      this.roomController.deleteRoom.bind(this.roomController)
    );
    this.router.get(
      "/:uuid",
      this.roomController.getRoomById.bind(this.roomController)
    );
    this.router.get(
      "/",
      this.roomController.getAllRooms.bind(this.roomController)
    );
    this.router.get(
      "/owner/:ownerId",
      this.roomController.getRoomsByOwner.bind(this.roomController)
    );
    this.router.get(
      "/participant/:userId",
      this.roomController.getRoomsByParticipant.bind(this.roomController)
    );
    this.router.get(
      "/active",
      this.roomController.getActiveRooms.bind(this.roomController)
    );
    this.router.get(
      "/archived",
      this.roomController.getArchivedRooms.bind(this.roomController)
    );
    this.router.post(
      "/participant",
      this.roomController.addParticipant.bind(this.roomController)
    );
    this.router.delete(
      "/participant",
      this.roomController.removeParticipant.bind(this.roomController)
    );
    this.router.put(
      "/participant/role",
      this.roomController.changeParticipantRole.bind(this.roomController)
    );
    this.router.put(
      "/participant/status",
      this.roomController.setParticipantActive.bind(this.roomController)
    );
    this.router.post(
      "/chat",
      this.roomController.sendMessage.bind(this.roomController)
    );
    this.router.delete(
      "/chat/:roomId",
      this.roomController.clearChat.bind(this.roomController)
    );
    this.router.post(
      "/vote",
      this.roomController.castVote.bind(this.roomController)
    );
    this.router.delete(
      "/vote/:roomId",
      this.roomController.resetVotes.bind(this.roomController)
    );
    this.router.put(
      "/settings/:roomId",
      this.roomController.updateSettings.bind(this.roomController)
    );
    this.router.put(
      "/status/:roomId",
      this.roomController.changeStatus.bind(this.roomController)
    );
    this.router.get(
      "/participants/count/:roomId",
      this.roomController.countParticipants.bind(this.roomController)
    );
    this.router.get(
      "/owner/count/:ownerId",
      this.roomController.countRoomsByOwner.bind(this.roomController)
    );
    // ACCESO
    this.router.post(
      "/:uuid/access-code",
      this.roomController.generateAccessCode.bind(this.roomController)
    );
    this.router.post(
      "/join/code",
      this.roomController.joinByAccessCode.bind(this.roomController)
    );
    this.router.post(
      "/:uuid/access-link",
      this.roomController.generateAccessLink.bind(this.roomController)
    );
    this.router.post(
      "/join/link",
      this.roomController.joinByAccessLink.bind(this.roomController)
    );
  }
}
