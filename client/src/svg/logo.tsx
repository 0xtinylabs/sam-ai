import * as React from "react";
import { SVGProps } from "react";
const LogoSVG = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={58}
    height={18}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M6.5 3H20v1.5H6.5zM23 15h12v-1.5H23zM38 15V4.5h1.5V15zM6.5 8.25h12v1.5h-12zM23 9.75h12v-1.5H23zM5 8.25V4.5h1.5v3.75zM21.5 9.75v3.75H23V9.75zM18.5 13.5V9.75H20v3.75zM35 4.5v3.75h1.5V4.5zM35 9.75v3.75h1.5V9.75zM44.75 15V4.5h1.5V15zM39.5 3h12v1.5h-12zM5 13.5h13.5V15H5zM23 4.5h12V3H23zM51.5 15V4.5H53V15zM56 16.5v-15h1.5v15zM2 16.5v-15H.5v15zM56 1.5h-3V0h3zM2 1.5h3V0H2zM56 18h-3v-1.5h3zM2 18h3v-1.5H2z"
    />
  </svg>
);
export default LogoSVG;
