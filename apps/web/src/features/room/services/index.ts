import type { ICollaborativeRoom } from "@repo/shared/types";
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
    const payload = {
      ...roomData,
      ownerId: userId,
      settings: {
        isPrivate: roomData.isPrivate,
        maxParticipants: roomData.maxParticipants,
        allowChat: roomData.allowChat,
        requireApprovalToJoin: roomData.requireApproval,
      },
      status: "active",
      features: {
        chat: roomData.chat,
        voting: roomData.voting,
        whiteboard: false,
        screenShare: false,
      },
      chat: [],
      participants: [
        {
          userId,
          role: "admin",
          joinedAt: new Date().toISOString(),
          isActive: true,
        },
      ],
    };

    const { data } = await ApiIntance.post<ICollaborativeRoom>("/room", payload);
    return data;
  };

  updateRoom = async (uuid: string, roomData: Partial<ICollaborativeRoom>) => {
    try {
      const response = await ApiIntance.put(`/room/${uuid}`, roomData);
      return response.data;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  };

  deleteRoom = async (uuid: string) => {
    try {
      const response = await ApiIntance.delete(`/room/${uuid}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  };

  getRoomById = async (uuid: string) => {
    try {
      const response = await ApiIntance.get(`/room/${uuid}`);
      return response.data;
    } catch (error) {
      console.error("Error getting room by ID:", error);
      throw error;
    }
  };

  getRoomsByOwner = async (ownerId: string) => {
    try {
      const response = await ApiIntance.get(`/room/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting rooms by owner:", error);
      throw error;
    }
  };

  getRoomsByParticipant = async (userId: string) => {
    try {
      const response = await ApiIntance.get(`/room/participant/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting rooms by participant:", error);
      throw error;
    }
  };

  getActiveRooms = async () => {
    try {
      const response = await ApiIntance.get("/room/active");
      return response.data;
    } catch (error) {
      console.error("Error getting active rooms:", error);
      throw error;
    }
  };

  getArchivedRooms = async () => {
    try {
      const response = await ApiIntance.get("/room/archived");
      return response.data;
    } catch (error) {
      console.error("Error getting archived rooms:", error);
      throw error;
    }
  };

  addParticipant = async (roomId: string, userId: string, role: string) => {
    try {
      const response = await ApiIntance.post(`/room/participant`, {
        roomId,
        userId,
        role,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding participant:", error);
      throw error;
    }
  };

  removeParticipant = async (roomId: string, userId: string) => {
    try {
      const response = await ApiIntance.delete(`/room/participant`, {
        data: { roomId, userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing participant:", error);
      throw error;
    }
  };

  changeParticipantRole = async (
    roomId: string,
    userId: string,
    newRole: string
  ) => {
    try {
      const response = await ApiIntance.put(`/room/participant/role`, {
        roomId,
        userId,
        newRole,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing participant role:", error);
      throw error;
    }
  };

  setParticipantActive = async (
    roomId: string,
    userId: string,
    isActive: boolean
  ) => {
    try {
      const response = await ApiIntance.put(`/room/participant/status`, {
        roomId,
        userId,
        isActive,
      });
      return response.data;
    } catch (error) {
      console.error("Error setting participant active status:", error);
      throw error;
    }
  };

  sendMessage = async (roomId: string, senderId: string, message: string) => {
    try {
      const response = await ApiIntance.post(`/room/chat`, {
        roomId,
        senderId,
        message,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  clearChat = async (roomId: string) => {
    try {
      const response = await ApiIntance.delete(`/room/chat/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error clearing chat:", error);
      throw error;
    }
  };

  castVote = async (roomId: string, userId: string, vote: string) => {
    try {
      const response = await ApiIntance.post(`/room/vote`, {
        roomId,
        userId,
        vote,
      });
      return response.data;
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  };

  resetVotes = async (roomId: string) => {
    try {
      const response = await ApiIntance.delete(`/room/vote/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("Error resetting votes:", error);
      throw error;
    }
  };

  updateSettings = async (roomId: string, settings: Partial<ICollaborativeRoom["settings"]>) => {
    try {
      const response = await ApiIntance.put(
        `/room/settings/${roomId}`,
        settings
      );
      return response.data;
    } catch (error) {
      console.error("Error updating room settings:", error);
      throw error;
    }
  };

  changeStatus = async (roomId: string, status: string) => {
    try {
      const response = await ApiIntance.put(`/room/status/${roomId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error changing room status:", error);
      throw error;
    }
  };

  countParticipants = async (roomId: string) => {
    try {
      const response = await ApiIntance.get(
        `/room/participants/count/${roomId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error counting participants:", error);
      throw error;
    }
  };

  countRoomsByOwner = async (ownerId: string) => {
    try {
      const response = await ApiIntance.get(`/room/owner/count/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error("Error counting rooms by owner:", error);
      throw error;
    }
  };

  generateAccessCode = async (uuid: string) => {
    try {
      const response = await ApiIntance.post(`/room/${uuid}/access-code`);
      return response.data;
    } catch (error) {
      console.error("Error generating access code:", error);
      throw error;
    }
  };

  joinByAccessCode = async (code: string, userId: string) => {
    try {
      const response = await ApiIntance.post(`/room/join/code`, {
        code,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error joining by access code:", error);
      throw error;
    }
  };

  generateAccessLink = async (uuid: string) => {
    try {
      const response = await ApiIntance.post(`/room/${uuid}/access-link`);
      return response.data;
    } catch (error) {
      console.error("Error generating access link:", error);
      throw error;
    }
  };

  joinByAccessLink = async (link: string, userId: string) => {
    try {
      const response = await ApiIntance.post(`/room/join/link`, {
        link,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error joining by access link:", error);
      throw error;
    }
  };
}

export default new RoomServices();
