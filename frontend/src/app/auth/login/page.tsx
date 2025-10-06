import LoginForm from "@/app/components/auth/LoginComponent";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
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
