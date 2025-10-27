import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../../../core/zustand/global_state";
import AuthenticationServices from "../../../../../features/auth/basic/services/auth_service";

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useGlobalStore();

  const {
    mutateAsync: create,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationKey: ["auth/register"],
    mutationFn: AuthenticationServices.register,
    onSuccess: (data: { message: string; token: string}) => {
      if (data.token) {
        setAuth(data.token);
        navigate("/");
      }
    },
    onError: (error) => {
      alert("Error al registrar. Verifica los datos ingresados." + error);
    },
  });

  return {
    create,
    isPending,
    isError,
    error,
  };
};
