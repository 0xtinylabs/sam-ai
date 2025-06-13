// hooks/useMessages.ts
"use client";

import { AsyncStream, DecodedMessage, Dm } from "@xmtp/browser-sdk";
import { useState, useEffect, useCallback } from "react";

export function useMessages(conversation: Dm<string> | null) {
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let stream: AsyncStream<DecodedMessage<string>> | undefined;

    const loadAndStreamMessages = async () => {
      if (!conversation) {
        setMessages([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const initialMessages = await conversation.messages();
        setMessages(initialMessages);

        // Stream new messages
        stream = await conversation.stream();
        for await (const message of stream) {
          if (message) {
            setMessages((prev) => {
              // Prevent duplicates if messages are already in the list
              if (!prev.some((msg) => msg.id === message.id)) {
                return [...prev, message];
              }
              return prev;
            });
          }
        }
      } catch (err: any) {
        console.error("Failed to load or stream messages:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndStreamMessages();

    return () => {
      if (stream) {
        stream.return(); // Terminate the stream on unmount
      }
    };
  }, [conversation]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversation) {
        setError(new Error("No conversation selected to send message."));
        return;
      }
      try {
        const sentMessage = (await conversation.send(text)) as any;
        setMessages((prev) => [...prev, sentMessage]);
      } catch (err: any) {
        console.error("Failed to send message:", err);
        setError(err);
      }
    },
    [conversation]
  );

  return { messages, isLoading, error, sendMessage };
}
