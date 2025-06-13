// hooks/useConversations.ts
"use client";

import { Client, Dm } from "@xmtp/browser-sdk";
import { useState, useEffect } from "react";

export function useConversations(xmtpClient: Client | null) {
  const [conversations, setConversations] = useState<Dm<string>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let stream: any;

    const loadConversations = async () => {
      if (!xmtpClient) {
        setConversations([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const allConversations: any = await xmtpClient.conversations.list();
        setConversations(allConversations);

        // Stream new conversations
        stream = await xmtpClient.conversations.stream();
        for await (const newConversation of stream) {
          setConversations((prev) => {
            if (
              !prev.some(
                (conv) => conv.peerInboxId === newConversation.peerInboxId
              )
            ) {
              return [...prev, newConversation];
            }
            return prev;
          });
        }
      } catch (err: any) {
        console.error("Failed to load or stream conversations:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();

    return () => {
      if (stream) {
        stream.return(); // Terminate the stream on unmount
      }
    };
  }, [xmtpClient]);

  const getOrCreateConversation = async (
    peerInboxId: string
  ): Promise<Dm<string> | null> => {
    if (!xmtpClient) {
      setError(new Error("XMTP client not connected."));
      return null;
    }
    try {
      const conversation = (await xmtpClient.conversations.newDm(
        peerInboxId
      )) as Dm<string>;

      setConversations((prev) => {
        if (
          !prev.some((conv) => conv.peerInboxId === conversation.peerInboxId)
        ) {
          return [...prev, conversation];
        }
        return prev;
      });
      return conversation;
    } catch (err: any) {
      console.error(
        `Failed to get or create conversation with ${peerInboxId}:`,
        err
      );
      setError(err);
      return null;
    }
  };

  return { conversations, isLoading, error, getOrCreateConversation };
}
