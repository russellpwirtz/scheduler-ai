import type { AppProps } from 'next/app';
import '../app/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // Add use of props to satisfy ESLint
  return <Component {...pageProps} />;
}

export default MyApp; 