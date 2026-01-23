import { ReactNode } from "react";
import SideNav from "./side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="mx-auto h-[calc(100vh-69px)]">
      <div className="flex gap-8 h-full">
        <SideNav />

        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
