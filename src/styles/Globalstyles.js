import { createGlobalStyle } from "styled-components";

import font from "./font/UhBeeSe_hyun.ttf";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "UhBeeSe_hyun";
    src: url(${font}) format("woff");
    font-weight: normal;
    font-style: normal;
  }
    
  * {
    margin: 0;
    padding: 0;
    font-family: "UhBeeSe_hyun";
  }
`;

export default GlobalStyle;
