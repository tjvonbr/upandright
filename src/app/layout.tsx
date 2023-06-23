import "./globals.css";
import "semantic-ui-css/semantic.min.css";
import AuthContext from "./dashboard/components/AuthContext";
import { Inter } from "next/font/google";
import { Session } from "next-auth";
import { headers } from "next/headers";
import Header from "./dashboard/components/Header";
import MainNavbar from "./components/MainNavbar";
import SubNavbar from "./components/SubNavbar";
import { navbarItems, subNavbarItems } from "./config/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(headers().get("cookie") ?? "");
  const { user } = session;

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext session={session}>
          <section>
            <Header user={user} />
            <MainNavbar items={navbarItems.mainNavbar} />
            <div>
              <div className="h-full w-9/10 flex-col items-center">
                <div className="m-5">
                  <h1 className="font-semibold text-3xl">Exercises</h1>
                  <SubNavbar items={subNavbarItems.exercises} />
                </div>
              </div>
            </div>
          </section>
          <main className="m-5">{children}</main>
        </AuthContext>
      </body>
    </html>
  );
}
