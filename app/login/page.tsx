import { redirect } from "next/navigation";
import getCurrentUser from "../commonFunction/getCurrentUser";
import LoginForm from "./loginForm";


export default async function RegisterPage() {
  const { email, role } = await getCurrentUser() || {}
  if (email) {
    redirect("/jobs")
  }
  return (
    <LoginForm />
  );
}
