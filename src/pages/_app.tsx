import type {AppProps} from 'next/app';
import styled, {createGlobalStyle} from 'styled-components';
import {Analytics} from '@vercel/analytics/react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Lato', Helvetica Neue;
    background-color: lightgrey;
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .firebase-emulator-warning {
    display: none;
  }
`;

export default function MyApp({Component, pageProps}: AppProps) {
  return (
    <Container>
      <GlobalStyle />
      <Component {...pageProps} />
      <Analytics />
    </Container>
  );
}
