import { useQuery } from "@tanstack/react-query";
import ProfileServices from "../services";
import { useGlobalStore } from "../../../core/zustand/global_state";
import { useEffect, useState } from "react";
import type { IUser } from "@repo/shared/types";

export const useGetById = () => {
  const { setProfile } = useGlobalStore();

  const { data, isPending, isError } = useQuery({
    queryKey: ["user/profile"],
    queryFn: ProfileServices.getProfile,
    retry: 1, // Number of retries in case of query errors
  });

  useEffect(() => {
    setProfile(data, isPending, isError);
  }, [data, setProfile]);
};

export const useGetOnlineUsers = () => {
  const [usersOnline, setUsersOnline] = useState([]);
  const { onlineUsers, profile } = useGlobalStore();

  const {
    data = onlineUsers,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["user/online"],
    queryFn: () => ProfileServices.getOnlineUsers(onlineUsers),
    retry: 1, // Number of retries in case of query errors
  });

  useEffect(() => {
    setUsersOnline(data);
  }, [data, setUsersOnline]);

  return {
    onlineUsers: usersOnline.filter(
      (user: Partial<IUser>) =>
        user.profile?.username !== profile.user?.profile.username
    ),
    isPending,
    isError,
  };
};
