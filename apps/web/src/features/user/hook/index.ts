import { useGetOnlineUsers } from "../queries"

export const useProfile = () => {
  const onlineUsers = useGetOnlineUsers();

  return {
    onlineUsers
  }
}