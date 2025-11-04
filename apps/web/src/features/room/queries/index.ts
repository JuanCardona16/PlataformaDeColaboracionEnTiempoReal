import { useMutation, useQuery } from "@tanstack/react-query";
import roomServices from "../services";
import { QueryClientConfig } from "@/core/config/react_query";
import { useEffect, useState } from "react";
import { useGlobalStore } from "@/core/zustand/global_state";

export const useGetAllRooms = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => roomServices.getAllRooms(),
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

export const useCreateRoom = () => {
  const {
    mutateAsync: create,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/create"],
    mutationFn: ({
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
    }) => roomServices.createRoom({ roomData, userId }),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["rooms"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByOwner"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    create,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for updating a room.
 * @param uuid The UUID of the room to update.
 * @param roomData The data to update the room with.
 */
export const useUpdateRoom = () => {
  const {
    mutateAsync: update,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/update"],
    mutationFn: ({
      uuid,
      roomData,
    }: {
      uuid: string;
      roomData: Record<string, unknown>;
    }) => roomServices.updateRoom(uuid, roomData),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["rooms"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByOwner"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    update,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for deleting a room.
 * @param uuid The UUID of the room to delete.
 */
export const useDeleteRoom = () => {
  const {
    mutateAsync: remove,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/delete"],
    mutationFn: (uuid: string) => roomServices.deleteRoom(uuid),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["rooms"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByOwner"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    remove,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for getting a room by its ID.
 * @param uuid The UUID of the room to retrieve.
 */
export const useGetRoomById = () => {
  const [roomUuid, setRoomUuid] = useState<string | null>("");

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["roomById", roomUuid],
    queryFn: () => roomServices.getRoomById(roomUuid!),
    enabled: !!roomUuid, // Only run the query if roomUuid is provided
  });

  const getUuid = (uuid: string) => {
    setRoomUuid(uuid);
  };

  useEffect(() => {
    if (roomUuid) {
      refetch();
    }
  }, [roomUuid, refetch]);

  return {
    getUuid,
    data,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for getting rooms by owner ID.
 */
export const useGetRoomsByOwner = () => {
  const { profile } = useGlobalStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["roomsByOwner", profile.user?.uuid],
    queryFn: () => roomServices.getRoomsByOwner(profile.user?.uuid ?? ""),
    enabled: !!profile.user?.uuid,
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for getting rooms by participant ID.
 * @param userId The ID of the participant.
 */
export const useGetRoomsByParticipant = () => {
  const { profile } = useGlobalStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["roomsByParticipant", profile.user?.uuid],
    queryFn: () => roomServices.getRoomsByParticipant(profile.user?.uuid ?? ""),
    enabled: !!profile.user?.uuid,
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for getting all active rooms.
 */
export const useGetActiveRooms = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["activeRooms"],
    queryFn: () => roomServices.getActiveRooms(),
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for getting all archived rooms.
 */
export const useGetArchivedRooms = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["archivedRooms"],
    queryFn: () => roomServices.getArchivedRooms(),
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for adding a participant to a room.
 */
export const useAddParticipant = () => {
  const {
    mutateAsync: addParticipant,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/addParticipant"],
    mutationFn: ({
      roomId,
      userId,
      role,
    }: {
      roomId: string;
      userId: string;
      role: string;
    }) => roomServices.addParticipant(roomId, userId, role),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["countParticipants"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    addParticipant,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for removing a participant from a room.
 */
export const useRemoveParticipant = () => {
  const {
    mutateAsync: removeParticipant,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/removeParticipant"],
    mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
      roomServices.removeParticipant(roomId, userId),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["countParticipants"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    removeParticipant,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for changing a participant's role in a room.
 */
export const useChangeParticipantRole = () => {
  const {
    mutateAsync: changeRole,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/changeParticipantRole"],
    mutationFn: ({
      roomId,
      userId,
      newRole,
    }: {
      roomId: string;
      userId: string;
      newRole: string;
    }) => roomServices.changeParticipantRole(roomId, userId, newRole),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    changeRole,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for setting a participant's active status in a room.
 */
export const useSetParticipantActive = () => {
  const {
    mutateAsync: setParticipantActive,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/setParticipantActive"],
    mutationFn: ({
      roomId,
      userId,
      isActive,
    }: {
      roomId: string;
      userId: string;
      isActive: boolean;
    }) => roomServices.setParticipantActive(roomId, userId, isActive),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    setParticipantActive,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for sending a message in a room chat.
 */
export const useSendMessage = () => {
  const {
    mutateAsync: sendMessage,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/sendMessage"],
    mutationFn: ({
      roomId,
      senderId,
      message,
    }: {
      roomId: string;
      senderId: string;
      message: string;
    }) => roomServices.sendMessage(roomId, senderId, message),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] }); // Assuming chat messages are part of room details
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    sendMessage,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for clearing a room's chat.
 */
export const useClearChat = () => {
  const {
    mutateAsync: clearChat,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/clearChat"],
    mutationFn: (roomId: string) => roomServices.clearChat(roomId),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] }); // Assuming chat messages are part of room details
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    clearChat,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for casting a vote in a room.
 */
export const useCastVote = () => {
  const {
    mutateAsync: castVote,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/castVote"],
    mutationFn: ({
      roomId,
      userId,
      vote,
    }: {
      roomId: string;
      userId: string;
      vote: string;
    }) => roomServices.castVote(roomId, userId, vote),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] }); // Assuming votes are part of room details
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    castVote,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for resetting votes in a room.
 */
export const useResetVotes = () => {
  const {
    mutateAsync: resetVotes,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/resetVotes"],
    mutationFn: (roomId: string) => roomServices.resetVotes(roomId),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] }); // Assuming votes are part of room details
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    resetVotes,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for updating room settings.
 */
export const useUpdateSettings = () => {
  const {
    mutateAsync: updateSettings,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/updateSettings"],
    mutationFn: ({
      roomId,
      settings,
    }: {
      roomId: string;
      settings: Record<string, unknown>;
    }) => roomServices.updateSettings(roomId, settings),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    updateSettings,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for changing room status.
 */
export const useChangeStatus = () => {
  const {
    mutateAsync: changeStatus,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/changeStatus"],
    mutationFn: ({ roomId, status }: { roomId: string; status: string }) =>
      roomServices.changeStatus(roomId, status),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["rooms"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["activeRooms"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["archivedRooms"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    changeStatus,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for counting participants in a room.
 * @param roomId The ID of the room.
 */
export const useCountParticipants = () => {
  const { profile } = useGlobalStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["countParticipants", profile.user?.uuid],
    queryFn: () => roomServices.countParticipants(profile.user?.uuid ?? ""),
    enabled: !!profile.user?.uuid,
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for counting rooms by owner.
 * @param ownerId The ID of the owner.
 */
export const useCountRoomsByOwner = () => {
  const { profile } = useGlobalStore();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["countRoomsByOwner", profile.user?.uuid],
    queryFn: () => roomServices.countRoomsByOwner(profile.user?.uuid ?? ""),
    enabled: !!profile.user?.uuid,
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for generating an access code for a room.
 */
export const useGenerateAccessCode = () => {
  const {
    mutateAsync: generateAccessCode,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/generateAccessCode"],
    mutationFn: (uuid: string) => roomServices.generateAccessCode(uuid),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    generateAccessCode,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for joining a room by access code.
 */
export const useJoinByAccessCode = () => {
  const {
    mutateAsync: joinByAccessCode,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/joinByAccessCode"],
    mutationFn: ({ code, userId }: { code: string; userId: string }) =>
      roomServices.joinByAccessCode(code, userId),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["rooms"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    joinByAccessCode,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for generating an access link for a room.
 */
export const useGenerateAccessLink = () => {
  const {
    mutateAsync: generateAccessLink,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/generateAccessLink"],
    mutationFn: (uuid: string) => roomServices.generateAccessLink(uuid),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["roomById"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    generateAccessLink,
    isPending,
    isError,
    error,
  };
};

/**
 * Hook for joining a room by access link.
 */
export const useJoinByAccessLink = () => {
  const {
    mutateAsync: joinByAccessLink,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["room/joinByAccessLink"],
    mutationFn: ({ link, userId }: { link: string; userId: string }) =>
      roomServices.joinByAccessLink(link, userId),
    onSuccess: () => {
      QueryClientConfig.invalidateQueries({ queryKey: ["rooms"] });
      QueryClientConfig.invalidateQueries({ queryKey: ["roomsByParticipant"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    joinByAccessLink,
    isPending,
    isError,
    error,
  };
};
