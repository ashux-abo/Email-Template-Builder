import LoginForm from "../../components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | PaletteMail",
  description: "Login to your PaletteMail account",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12">
      <LoginForm />
    </div>
  );
}
