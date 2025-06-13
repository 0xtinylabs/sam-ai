import React, { useState } from "react";
import * as Button from "@/components/ui/button";
import {
  RiAlarmLine,
  RiCloseLine,
  RiMicFill,
  RiMicOffFill,
  RiSearch2Line,
} from "@remixicon/react";
import clsx from "clsx";
import { useLocalStorage } from "usehooks-ts";
import api from "@/service/api";
import { useAccount } from "wagmi";
import TokenSelectModal from "../modals/token-select";
import useVoice from "@/hooks/useVoice";

const Prompt = () => {
  const { address } = useAccount();

  const [message, setMessage] = useState("");
  const [, setMessages] = useLocalStorage("XMTP_MESSAGES_" + address, [], {
    deserializer(value) {
      return JSON.parse(value);
    },
    serializer(value) {
      return JSON.stringify(value);
    },
  });
  const [selectedToken, setSelectedtoken] = useState<any>(null);
  const { playText } = useVoice();
  const [muted, setMuted] = useLocalStorage("muted", false, {
    serializer(value) {
      return String(value);
    },
    deserializer(value) {
      return value === "false" ? false : true;
    },
  });

  return (
    <div className={clsx("input-section p-[14px] pt-5")}>
      {selectedToken && (
        <span className="text-green-500 flex group cursor-pointer items-center">
          {"{"}${selectedToken?.name?.trim()}
          {"}"}
          <Button.Icon
            className="opacity-0 group-hover:opacity-80"
            as={RiCloseLine}
            onClick={() => {
              setSelectedtoken(null);
            }}
          />
        </span>
      )}
      <input
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={async (e) => {
          if (!address) {
            return;
          }
          if (e.key === "Enter") {
            setMessage("");

            setMessages((m: any) => [
              ...m,
              {
                type: "user",
                content:
                  message +
                  (selectedToken ? " : " + selectedToken.name?.trim() : ""),
              },
            ]);
            const response = await api.sendMessage(
              message +
                (selectedToken ? " The token: " + selectedToken?.address : ""),
              address
            );
            if (!muted) {
              const cleaned = response.replace(/0x[a-zA-Z0-9;.,]{10,}/g, "");

              playText(cleaned);
            }
            setMessages((m: any) => [...m, { type: "ai", content: response }]);
            setSelectedtoken(null);
          }
        }}
        placeholder="Ask anything..."
        className="group px-[10px] w-full text-label-sm bg-transparent border-none outline-none text-text-strong-950 placeholder:text-text-soft-400"
      />
      <div className="flex justify-between">
        <div className="">
          <Button.Root
            onClick={async () => {
              if (!address) {
                return;
              }
              setMessages((m: any) => [
                ...m,
                { type: "user", content: "what is my alerts" },
              ]);
              const response = await api.sendMessage(
                "what is my alerts",
                address
              );
              setMessages((m: any) => [
                ...m,
                { type: "ai", content: response },
              ]);
            }}
            size="xsmall"
            mode="ghost"
            variant="neutral"
          >
            <Button.Icon as={RiAlarmLine} />
          </Button.Root>
        </div>
        <div className="">
          <TokenSelectModal
            onSelectToken={(t) => {
              setSelectedtoken(t);
            }}
          >
            <Button.Root size="xsmall" mode="ghost" variant="neutral">
              <Button.Icon as={RiSearch2Line} />
            </Button.Root>
          </TokenSelectModal>
          <Button.Root
            onClick={() => {
              setMuted(!muted);
            }}
            size="xsmall"
            mode="ghost"
            variant="error"
          >
            <Button.Icon as={muted ? RiMicOffFill : RiMicFill} />
          </Button.Root>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
