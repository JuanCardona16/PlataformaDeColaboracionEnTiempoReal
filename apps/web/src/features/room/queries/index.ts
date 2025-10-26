import { useQuery } from "@tanstack/react-query"
import roomServices from '../services'

export const useGetAllRooms = () => {

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomServices.getAllRooms(),
  })

  return {
    data,
    isPending,
    isError,
    error,
  }

}