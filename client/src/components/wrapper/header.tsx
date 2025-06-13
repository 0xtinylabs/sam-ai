import React from "react";
import ConnectButton from "../base/connect-button";
import LogoSVG from "@/svg/logo";

const Header = () => {
  return (
    <header className="header px-4 py-3 flex justify-between items-center">
      <LogoSVG />
      <ConnectButton />
    </header>
  );
};

export default Header;
