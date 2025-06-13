"use client";
import React from "react";
import * as Button from "@/components/ui/button";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { shortenWalletAddress } from "@/helpers/string";
import { RiFileCopyLine } from "@remixicon/react";
import { useCopyToClipboard } from "usehooks-ts";

const ConnectButton = () => {
  // get from onchainkit
  const { address } = useAccount();
  const connected = Boolean(address);
  const { disconnect } = useDisconnect();
  const [, copy] = useCopyToClipboard();

  if (!connected) {
    return (
      <Button.Root
        className="relative overflow-hidden"
        type="button"
        variant="neutral"
        mode="filled"
        size="xsmall"
      >
        CONNECT
        <Wallet className="absolute max-w-full opacity-0 max-h-full " />
      </Button.Root>
    );
  } else {
    return (
      <div className="relative ">
        <Button.Root
          className="relative z-[80]"
          type="button"
          variant="neutral"
          mode="stroke"
          size="xsmall"
          onClick={() => {
            disconnect();
          }}
        >
          [{shortenWalletAddress(address)}]
          <Button.Icon
            onClick={(e) => {
              e.stopPropagation();
              copy(address as string);
            }}
            className="relative z-[100]"
            as={RiFileCopyLine}
          />
        </Button.Root>
      </div>
    );
  }
};

export default ConnectButton;
