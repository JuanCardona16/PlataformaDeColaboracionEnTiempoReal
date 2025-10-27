import { useGetAllRooms } from "../queries"

export const useRoom = () => { 
  const getAllRooms = useGetAllRooms();

  return {
    getAllRooms
  }

}