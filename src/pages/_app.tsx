import type { AppProps } from "next/app";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SHOPIFY_GRAPHQL_URL,
  cache: new InMemoryCache(),
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token":
      process.env.NEXT_PUBLIC_SHOPIFY_GRAPHQL_URL_ACCESS_TOKEN!,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
