import { CodegenConfig } from "@graphql-codegen/cli";

const SHOPIFY_URL = process.env.NEXT_PUBLIC_SHOPIFY_GRAPHQL_URL;

const config: CodegenConfig = {
  schema: {
    [`${SHOPIFY_URL}`]: {
      headers: {
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_SHOPIFY_GRAPHQL_URL_ACCESS_TOKEN!,
      },
    },
  },
  documents: ["src/**/*.tsx"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
