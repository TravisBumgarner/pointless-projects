import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Satoshi';
    src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
         url('/fonts/Satoshi-Variable.woff') format('woff'),
         url('/fonts/Satoshi-Variable.ttf') format('ttf');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --swatch-size: min(16vw);
    --gutter-spacing: 1vw;
    --background-color: #ffffff;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    font-family: "Satoshi", sans-serif;
    background-color: #ffffff;
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: "Anton SC", sans-serif;
    font-weight: 400;
    font-style: normal;
    /* padding: calc(var(--gutter-spacing) * 2); */
    box-sizing: border-box;
  }
`;
