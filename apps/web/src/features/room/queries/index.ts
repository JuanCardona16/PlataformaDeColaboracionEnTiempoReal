import { useMutation, useQuery } from "@tanstack/react-query";
import roomServices from "../services";
import { QueryClientConfig } from "@/core/config/react_query";

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
