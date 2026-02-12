import { redirect } from "next/navigation";
import getCurrentUser from "../commonFunction/getCurrentUser";
import LoginForm from "./loginForm";
import { Types } from "mongoose";


export default async function RegisterPage() {
  const { email, role, sub } = await getCurrentUser() || {}
  if (email && role && sub && Types.ObjectId.isValid(sub)) {
    if(role === "jobseeker") {
       redirect("/jobs")
    } else {
      redirect("/recruiter")
    }
  }
  return (
    <LoginForm />
  );
}
