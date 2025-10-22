import LoginForm from "@/app/components/auth/LoginComponent";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div
      className="
        min-h-screen 
        flex flex-col 
        items-center justify-center 
        bg-cover bg-center"
      style={{ backgroundImage: "url('/login/login-1.jpg')" }}
    >
      <Image
        src="/PeerPrepLogo.png"
        alt="PeerprepLogo"
        width={200}
        height={200}
      />
      <LoginForm />
    </div>
  );
}
