import { twJoin } from "tailwind-merge";

import UserNav from "@/components/UserNav";

import { buttonVariants } from "../components/common/button";

interface ExercisesLayoutProps {
  children: React.ReactNode;
}

export default function ExercisesLayout({ children }: ExercisesLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-10 py-2 px-4 flex justify-between items-center border-b border-slate-200">
        <UserNav />
        <button className={twJoin(buttonVariants({ variant: "ghost" }))}>
          Sign out
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}
