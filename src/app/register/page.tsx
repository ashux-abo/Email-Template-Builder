import RegisterForm from "../../components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Sendly",
  description: "Create a new account for Sendly",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-12">
      <RegisterForm />
    </div>
  );
}
