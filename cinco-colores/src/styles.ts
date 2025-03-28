import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Satoshi';
    src: url('/fonts/Satoshi-Regular.woff2') format('woff2'),
         url('/fonts/Satoshi-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Satoshi';
    src: url('/fonts/Satoshi-Bold.woff2') format('woff2'),
         url('/fonts/Satoshi-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --swatch-size: min(120px, 10vw);
    --gutter-spacing: 1vw;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Anton SC", sans-serif;
    font-weight: 400;
    font-style: normal;
    padding: calc(var(--gutter-spacing) * 2);
  }
`;
