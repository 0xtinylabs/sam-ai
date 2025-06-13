import React, { PropsWithChildren } from "react";
import Header from "./header";

const Wrapper = (props: PropsWithChildren) => {
  return (
    <div
      className="w-screen h-screen overflow-hidden p-3 "
      style={{
        backgroundImage: "url(/bg.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-[60ch] h-full mx-auto flex flex-col overflow-hidden">
        <Header />
        {props.children}
      </div>
    </div>
  );
};

export default Wrapper;
