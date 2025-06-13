import { useEffect, useState } from "react";
import { useConversations } from "./useConversations";
import { useXmtpClient } from "./useXMTPClient";
import { useMessages } from "./useMessages";
import { Dm } from "@xmtp/browser-sdk";

const useXmtp = () => {
  const { xmtpClient } = useXmtpClient({ env: "production" });
  const { getOrCreateConversation, conversations } =
    useConversations(xmtpClient);
  const [conversation, setConversation] = useState<Dm<string> | null>(null);
  const message = useMessages(conversation);

  const getServerConversation = async () => {
    const c = await getOrCreateConversation(
      process.env.NEXT_PUBLIC_XMTP_SERVER_ADDRESS ?? ""
    );
    setConversation(c);
  };

  useEffect(() => {
    if (xmtpClient) {
      getServerConversation();
    }
  }, [xmtpClient]);

  return { conversation, message, xmtpClient, conversations };
};

export default useXmtp;
