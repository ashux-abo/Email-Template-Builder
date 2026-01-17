import LoginForm from "../../components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Email Sender",
  description: "Login to your Email Sender account",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12">
      <LoginForm />
    </div>
  );
}
