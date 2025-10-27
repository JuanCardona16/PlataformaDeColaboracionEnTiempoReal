import { Link } from "react-router-dom";
import { useAuth } from "../../../features/auth/basic/hook/useAuth";
import { useForm } from "../../../hooks";
import { Eye, EyeOff, Lock, Mail, Shield, Users, Vote, Zap } from 'lucide-react'
import imagen from "../../../assets/images/collaborative-voting-and-decision-making-illustrat.jpg"

const LoginPage = () => {
  const {
    FormData,
    IsVisiblePassword,
    handleSubmit,
    toogleVisiblePassword,
    handleChange,
    FormDataError,
  } = useForm({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 ">
        <div className="w-full max-w-md flex flex-col gap-5">
          {/* Logo */}
          <Link to={"/"} className="flex items-center justify-center gap-3">
            <div className="size-12 rounded-xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Vote className="size-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">VoteSync</span>
          </Link>

          <div className="bg-card border-border shadow-xl p-4 rounded-lg">
            <div className="space-y-1 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                Iniciar Sesion
              </div>
              <div className="text-muted-foreground">
                Ingresa tus credenciales para acceder a tu cuenta
              </div>
            </div>
            <div>
              <form
                onSubmit={handleSubmit(() => login.authenticate(FormData))}
                className="flex flex-col gap-2 mt-5">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground">
                    Correo Electronico:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ejemplo@ejemplo.com"
                      value={FormData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 py-2 pr-12 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary ${FormDataError.email ? "border-destructive" : "border-border"}`}
                    />
                  </div>
                  {FormDataError.email && (
                    <span className="text-xs text-destructive">
                      {FormDataError.email}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground">
                    Contraseña:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock />
                    </span>
                    <input
                      id="password"
                      name="password"
                      placeholder="********"
                      type={IsVisiblePassword ? "text" : "password"}
                      value={FormData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 py-2 pr-12 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary ${FormDataError.password ? "border-destructive" : "border-border"}`}
                    />
                    <button
                      type="button"
                      onClick={toogleVisiblePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                      {IsVisiblePassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                  {FormDataError.password && (
                    <span className="text-xs text-destructive">
                      {FormDataError.password}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={login.isPending}
                  className="bg-gray-900 text-white p-2 rounded-md mt-3 mb-4 cursor-pointer hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {login.isPending ? "Cargando..." : "Iniciar Sesion"}
                </button>
              </form>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-sm text-center text-muted-foreground">
                No tienes una cuenta?{" "}
                <Link
                  to={"/register"}
                  className="text-primary hover:underline font-medium">
                  Create una aqui!
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Illustration and Features */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-primary/10 via-purple-500/10 to-background relative overflow-hidden">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center w-full">
          <h2 className="text-xl font-bold text-foreground mb-2 text-balance">
            Make decisions in real time
          </h2>
          <p className="text-base text-gray-400 mb-5 max-w-md text-pretty">
            Collaborate with your team, vote in real time and visualize results
            instantly
          </p>

          {/* Illustration placeholder */}
          <div className="mb-8 relative">
            <div className="size-64 rounded-2xl bg-linear-to-br from-primary/20 to-purple-600/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
              <img
                src={imagen}
                alt="Collaborative voting"
                className="size-48 opacity-90 object-cover rounded-lg"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 size-20 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
              <Users className="size-10 text-primary" />
            </div>
            <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center">
              <Zap className="size-10 text-purple-400" />
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-4 w-full max-w-md grid-cols-4 grid-rows-2 place-items-center">
            <div className="col-span-2">
              <div className="flex items-center gap-3 text-lef">
                <div className="size-10 rounded-lg bg-purple-500/20 backdrop-blur-sm border-purple-500/30 flex items-center justify-center shrink-0">
                  <Zap className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Instant voting</p>
                  <p className="text-sm text-gray-400">Real-time results</p>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-3 text-left ">
                <div className="size-10 rounded-lg bg-purple-500/20 backdrop-blur-sm border-purple-500/30 flex items-center justify-center shrink-0">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Fluid collaboration
                  </p>
                  <p className="text-sm text-gray-400">
                    Integrated chat and active participants
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex items-center gap-3 text-left">
                <div className="size-10 rounded-lg bg-purple-500/20 backdrop-blur-sm border-purple-500/30 flex items-center justify-center shrink-0">
                  <Shield className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Secure and reliable
                  </p>
                  <p className="text-sm text-gray-400">
                    JWT authentication and encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
