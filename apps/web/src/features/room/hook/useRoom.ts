import { useCreateRoom, useGetAllRooms } from "../queries"

export const useRoom = () => { 
  const getAllRooms = useGetAllRooms();
  const createRoom = useCreateRoom();

  return {
    getAllRooms,
    createRoom
  }

}