import ImageGallery from "@/components/ImageGallery";
import { gql } from "@/__generated__";
import { GetProductQuery, SelectedOption } from "@/__generated__/graphql";
import { useMutation } from "@apollo/client/react/hooks";
import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { client } from "./_app";

interface IProps {
  title: String;
  images: any;
  variants:
    | Array<{
        __typename?: "ProductVariantEdge";
        node: {
          __typename?: "ProductVariant";
          id: string;
          image?: { __typename?: "Image"; url: any } | null;
          selectedOptions: Array<{
            __typename?: "SelectedOption";
            name: string;
            value: string;
          }>;
        };
      }>
    | undefined;
  variantTypes: string[];
}

const GET_PRODUCT = gql(`
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description

        images(first: 10) {
          edges {
            node {
              id
              originalSrc
            }
          }
        }

        variants(first: 10) {
          edges {
            node {
              id
              image {
                url
              }
              selectedOptions {
                name
                value
              }
            }
          }
        } 
      }
    }
`);

const ADD_TO_CART = gql(`
  mutation AddToCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        cost {
          totalAmount {
            amount
          }
        }
        checkoutUrl
      }
    }
  }
`);

const ProductPage = ({
  title,
  images,
  variantTypes,
  variants,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [selectedVariants, setSelectedVariants] = useState(
    variantTypes.map((variant) => ({
      name: variant,
      value: null,
    }))
  );

  const merchandiseId = variants?.find((variant) =>
    variant.node.selectedOptions.every(
      (option) =>
        selectedVariants.find(
          (selectedVariant) =>
            selectedVariant.name === option.name &&
            selectedVariant.value === option.value
        ) !== undefined
    )
  )?.node.id!;

  const allVariantsSelected = selectedVariants.every(
    (selectedVariant) => selectedVariant.value !== null
  );

  const [addToCart, { data, loading, error }] = useMutation(ADD_TO_CART, {
    variables: {
      input: {
        lines: [
          {
            merchandiseId,
            quantity: 1,
          },
        ],
      },
    },
    onCompleted: (data) => {
      localStorage.setItem("cartId", data.cartCreate?.cart?.id!);
    },
  });

  return (
    <div className="mt-32 px-32 flex">
      <ImageGallery images={images} />
      <div>
        <h1 className="text-3xl">
          <b>{title}</b>
        </h1>
        <hr className="bg-red-500 w-full mt-3" />
        {variantTypes.map((variantType) => (
          <div className="mt-3" key={variantType}>
            <h2 className="text-xl">
              <b>{variantType}</b>
            </h2>
            <div>
              {variants?.map((variant: any) => {
                const selectedOption = variant.node.selectedOptions.find(
                  (option: SelectedOption) => option.name === variantType
                );

                if (selectedOption) {
                  return (
                    <button
                      className={`bg-gray-200 px-5 py-2 m-1 rounded-md cursor-pointer ${
                        selectedVariants.find(
                          (selectedVariant) =>
                            selectedVariant.name === variantType
                        )?.value === selectedOption.value
                          ? "bg-red-500 text-white font-semibold transition-all"
                          : ""
                      }`}
                      key={selectedOption.value}
                      onClick={() => {
                        setSelectedVariants((prev) =>
                          prev.map((selectedVariant) => {
                            if (selectedVariant.name === variantType) {
                              return {
                                ...selectedVariant,
                                value: selectedOption.value,
                              };
                            }

                            return selectedVariant;
                          })
                        );
                      }}
                    >
                      {selectedOption.value}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        ))}
        <button
          disabled={!allVariantsSelected}
          className="mt-6 bg-red-500 p-2 w-full rounded-md text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-20"
          onClick={() => addToCart()}
        >
          {loading ? "Adding to cart..." : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetStaticProps<IProps> = async (context) => {
  if (!context.params?.handle && typeof context.params?.handle !== "string") {
    return {
      notFound: true,
    };
  }

  const product = await client.query({
    query: GET_PRODUCT,
    variables: {
      handle: context.params?.handle as string,
    },
  });

  console.log(
    product.data.productByHandle?.variants.edges[0].node.selectedOptions[0].name
  );

  const variantTypes = product.data.productByHandle?.variants.edges.reduce(
    (acc: string[], variant) => {
      variant.node.selectedOptions.forEach((option) => {
        if (!acc.includes(option.name)) {
          acc.push(option.name);
        }
      });

      return acc;
    },
    []
  ) as string[];

  return {
    props: {
      title: product.data.productByHandle?.title!,
      images: product.data.productByHandle?.images?.edges,
      variants: product.data.productByHandle?.variants.edges,
      variantTypes,
    },
  };
};

export default ProductPage;
