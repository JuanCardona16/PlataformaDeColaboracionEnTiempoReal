import { useLogin } from "../queries/login/login_query";
import { useRegister } from "../queries/register/register_query";

export const useAuth = () => {
  const login = useLogin()
  const register = useRegister()

  return {
    login,
    register
  }
};