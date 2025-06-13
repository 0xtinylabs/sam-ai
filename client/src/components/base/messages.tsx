"use client";

import useXmtp from "@/hooks/useXmtp";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";

const Messages = () => {
  useXmtp();
  const { address } = useAccount();

  const [messages] = useLocalStorage("XMTP_MESSAGES_" + address, [], {
    deserializer(value) {
      return JSON.parse(value);
    },
    serializer(value) {
      return JSON.stringify(value);
    },
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current?.scrollTo({
        top: containerRef?.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      className="flex-1 flex flex-col py-10 overflow-auto pr-5"
      ref={containerRef}
    >
      {messages?.map(
        (message: { type: "ai" | "user"; content: string }, index: number) => {
          return (
            <pre
              style={{
                alignSelf: message.type === "ai" ? "flex-start" : "flex-end",
              }}
              key={index}
              className={clsx(
                "text-label-sm text-text-strong-950 mb-10 max-w-[70%] whitespace-pre-wrap break-words  rounded-md relative",
                message.type === "user" && "text-text-sub-600"
              )}
            >
              {message.type === "user" && (
                <div className="bg-black-alpha-24 opacity-20 absolute top-0 left-0 w-full h-full">
                  {" "}
                </div>
              )}
              {message.content}
            </pre>
          );
        }
      )}
    </div>
  );
};

export default Messages;
