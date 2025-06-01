import { GoogleIcon } from "@/assets/svgs/google-icon";
import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Shadcn/button";
import Image from "next/image";
import Link from "next/link";

const SignUp = () => {
  return (
    <main className="flex items-center p-3 h-screen">
      <div className="w-full flex items-center justify-center flex-col ">
        <div className="flex flex-col max-w-[420px] w-full px-4 sm:px-0">
          <div className="flex flex-col gap-8 md:gap-12 w-full">
            <Logo />
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-4xl ">Cadastrar-se</h3>
                <p className="text-text-muted">
                  Seja bem vindo! vamos criar sua conta.
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
                  id="username"
                  name="username"
                  label="Nome de usuario"
                  placeholder="Insira seu nome"
                />
                <Input
                  id="password"
                  name="password"
                  label="Senha"
                  placeholder="Insira sua senha"
                  type="password"
                />
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  label="Confirmar senha"
                  placeholder="Insira a confirmação de sua senha"
                  type="password"
                />

                <Button size={"lg"}>Criar conta</Button>
                <Button size={"lg"} variant={"outline"}>
                  <GoogleIcon />
                  Acessar com google
                </Button>

                <div className="flex items-center justify-center gap-1">
                  <span className="text-text-muted">Ja tem uma conta? </span>
                  <Link href={"/sign-in"} className="text-primary">
                    Acesse aqui
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

export default SignUp;
