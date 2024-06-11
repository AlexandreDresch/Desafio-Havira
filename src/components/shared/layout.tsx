import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="absolute flex min-h-screen w-full h-full flex-col py-3 px-4 sm:px-6">
      {children}
    </main>
  );
}
