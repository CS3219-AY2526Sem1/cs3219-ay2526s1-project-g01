import SignupForm from "@/app/components/auth/SignUpComponent";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/login/login-1.jpg')" }}
    >
      <SignupForm />
    </div>
  );
}
