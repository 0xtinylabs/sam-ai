"use client";

import type { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import { State } from "wagmi";

export function Providers(props: { children: ReactNode; initialState: State }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      {...props.initialState}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
