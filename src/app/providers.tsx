"use client";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
}
