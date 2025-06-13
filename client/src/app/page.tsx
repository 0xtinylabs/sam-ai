"use client";

import dynamic from "next/dynamic";

const Messages = dynamic(
  () => import("@/components/base/messages"), // Adjust this path if 'messages.tsx' is not directly imported
  { ssr: false }
);
import Prompt from "@/components/base/prompt";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Messages />
      <Prompt />
    </div>
  );
}
