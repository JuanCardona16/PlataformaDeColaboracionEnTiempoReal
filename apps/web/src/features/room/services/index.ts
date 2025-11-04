import { ApiIntance } from "../../../infraestructure/api/config";

class RoomServices {
  getAllRooms = async () => {
    const response = await ApiIntance.get("/room");
    return response.data;
  };

  createRoom = async ({
    roomData,
    userId,
  }: {
    roomData: {
      name: string;
      description: string;
      isPrivate: boolean;
      maxParticipants: number;
      allowChat: boolean;
      requireApproval: boolean;
      chat: boolean;
      voting: boolean;
    };
    userId: string;
  }) => {
    const {
      name,
      description,
      isPrivate,
      maxParticipants,
      allowChat,
      requireApproval,
      chat,
      voting,
    } = roomData;

    const data = {
      name,
      description,
      ownerId: userId,
      settings: {
        isPrivate,
        maxParticipants,
        allowChat,
        requireApprovalToJoin: requireApproval,
      },
      status: "active",
      features: {
        chat,
        voting,
        whiteboard: false,
        screenShare: false,
      },
      chat: [],
      participants: [
        {
          userId,
          role: "admin",
          joinedAt: new Date(),
          isActive: true,
        },
      ],
    };

    const response = await ApiIntance.post("/room", data);
    return response.data;
  };

  
}

export default new RoomServices();
