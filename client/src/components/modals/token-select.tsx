import React, { useEffect, useState } from "react";
import * as Modal from "@/components/ui/modal";
import * as Button from "@/components/ui/button";
import * as Input from "@/components/ui/input";
import { RiCloseLine, RiSearch2Line } from "@remixicon/react";
import Image from "next/image";
import numeral from "numeral";

const TokenSelectModal = (props: {
  children: React.JSX.Element;
  onSelectToken: (token: any) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const [query, setQuery] = useState("");
  const [tokens, setTokens] = useState<
    {
      name: string;
      network: string;
      address: string;
      price: number;
      mcap: number;
      vol: number;
      image?: string;
    }[]
  >([]);

  const getTokens = async () => {
    const res = await fetch(
      `https://pro-api.coingecko.com/api/v3/onchain/search/pools?query=${query}`,
      {
        headers: {
          "x-cg-pro-api-key": process.env.NEXT_PUBLIC_COIN_API_KEY,
        },
      }
    );
    const data = await res.json();
    console.log(data);

    const base_data = data?.data?.filter(
      (d: any) =>
        d?.relationships?.base_token?.data?.id?.split("_")[0] === "base"
    );

    const tokens: any[] = [];

    for (const i of base_data) {
      const token: any = {
        name: i?.attributes?.name?.split("/")[0],
        network: i?.relationships?.base_token?.data?.id?.split("_")[0],
        address: i?.relationships?.base_token?.data?.id?.split("_")[1],
        price: i?.relationships?.base_token_price_usd,
        mcap: i?.attributes?.market_cap_usd ?? i?.attributes?.fdv_usd,
        vol: i?.attributes?.volume_usd?.h1,
      };
      try {
        const res = await fetch(
          `https://pro-api.coingecko.com/api/v3/onchain/networks/base/tokens/${token.address}`,
          {
            headers: {
              "x-cg-pro-api-key": process.env.NEXT_PUBLIC_COIN_API_KEY,
            },
          }
        );
        const d = await res.json();
        token.image = d?.data?.attributes?.image_url;
        tokens.push(token);
      } catch {
        tokens.push(token);
      }
    }

    console.log(tokens);
    setTokens(tokens);
  };
  useEffect(() => {
    setTokens([]);
    if (query.length > 2) {
      getTokens();
    }
  }, [query]);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        {props.children &&
          React.cloneElement(props.children, {
            onClick: () => {
              setOpen(true);
            },
          })}
      </Modal.Trigger>
      <Modal.Content
        showClose={false}
        className="max-w-[40vw] h-[50vh] max-h-[50vh] flex flex-col flex-1 overflow-hidden"
      >
        <Modal.Body className="flex-1 overflow-hidden flex-col flex">
          <Input.Root className="bg-transparent !border-none">
            <Input.Wrapper className="bg-transparent !border-none">
              <Input.Icon as={RiSearch2Line} />
              <Input.Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder="Search or jump to"
                className="bg-transparent border-none"
              ></Input.Input>
              <Button.Icon
                className="cursor-pointer"
                as={RiCloseLine}
                onClick={() => {
                  setQuery("");
                }}
              />
            </Input.Wrapper>
          </Input.Root>
          <div className="flex-1 overflow-auto py-4 text-label-sm text-stroke-strong-950">
            {tokens.map((token) => {
              return (
                <div
                  className="flex justify-between items-center gap-x-4 mb-6 hover:bg-bg-soft-200 p-2 rounded-md cursor-pointer"
                  key={token.address}
                  onClick={() => {
                    props.onSelectToken(token);
                    setOpen(false);
                  }}
                >
                  {token.image && (
                    <Image
                      src={token.image}
                      width={36}
                      height={36}
                      alt="token"
                    />
                  )}
                  <div className="flex-1 flex justify-between">
                    <div>
                      <div className="text-label-sm text-text-strong-950">
                        {token.name}
                      </div>
                      <div className="text-text-sub-600">{token.network}</div>
                    </div>
                    <div>
                      <div className="text-text-strong-950 text-right">
                        {numeral(token.mcap).format("0.0a")}{" "}
                        <span className="text-text-sub-600">MC</span>
                      </div>
                      <div className="text-text-strong-950 text-right">
                        {numeral(token.vol).format("0.0a")}{" "}
                        <span className="text-text-sub-600">VOL</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="small"
              className="w-full"
            >
              Cancel
            </Button.Root>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default TokenSelectModal;
