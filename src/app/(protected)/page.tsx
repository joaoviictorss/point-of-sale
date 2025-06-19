import { logout } from "@/actions";
import { Button } from "@/components/Shadcn/button";

const Home = () => {
  return (
    <main>
      <h1>Home protegida</h1>
      <form action={logout}>
        <Button>Sair</Button>
      </form>
    </main>
  );
};

export default Home;
