import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
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
    padding: var(--gutter-spacing);
  }
`;
