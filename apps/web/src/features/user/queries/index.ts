import { useQuery } from "@tanstack/react-query";
import ProfileServices from "../services";
import { useGlobalStore } from "../../../core/zustand/global_state";
import { useEffect } from "react";

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
