import { GoogleIcon } from "@/assets/svgs/google-icon";
import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Shadcn/button";
import Image from "next/image";
import Link from "next/link";

const SignIn = () => {
  return (
    <main className="flex items-center p-3 h-screen">
      <div className="w-full flex items-center justify-center flex-col">
        <div className="flex flex-col max-w-[420px] w-full px-4 sm:px-0">
          <div className="flex flex-col gap-8 md:gap-12 sm:min-w-[420px] w-full">
            <Logo />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-4xl ">Entrar</h3>
                <p className="text-text-muted">
                  Bem vindo de volta! Por favor insira suas credenciais
                </p>
              </div>

              <form className="flex flex-col gap-5">
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Insira seu email"
                />
                <Input
                  id="password"
                  name="password"
                  label="Senha"
                  placeholder="Insira sua senha"
                  type="password"
                />

                <div className="flex items-center justify-between sm:flex-row">
                  <Checkbox id="remember" label="Permanecer conectado" />

                  <Link
                    href={"/forgot-password"}
                    className="text-primary hover:text-primary/90 transition-colors duration-75 text-sm"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <Button size={"lg"}>Entrar</Button>
                <Button size={"lg"} variant={"outline"}>
                  <GoogleIcon />
                  Acessar com google
                </Button>

                <div className="flex items-center justify-center gap-1">
                  <span className="text-text-muted">
                    Ainda não tem uma conta?
                  </span>
                  <Link href={"/sign-up"} className="text-primary">
                    Cadastre-se
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full relative h-full hidden lg:block">
        <Image
          src={"/hero-login.png"}
          alt="Hero Login"
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </main>
  );
};

export default SignIn;
