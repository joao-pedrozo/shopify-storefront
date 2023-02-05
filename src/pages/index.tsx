import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { gql } from "../__generated__/gql";

const GET_PRODUCTS = gql(`
  query GetProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          createdAt
          updatedAt
          handle
          variants(first: 10) {
						edges {
              node {
                title
                id
                image {
                  url
                }
              }
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

export default function Home({ title }: any) {
  const { data } = useQuery(GET_PRODUCTS);
  const [cartId, setCartId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [mutate, { data: teste, loading, error }] = useMutation(ADD_TO_CART);

  return (
    <div className="px-64 py-32">
      {data?.products.edges.map((product) => (
        <a
          key={product.node.id}
          className="flex flex-col max-w-fit border-2"
          href={`/${product.node.handle}`}
        >
          <h1 className="text-center">{product.node.title}</h1>
          <input
            type="number"
            value={quantity}
            onChange={(ev) => setQuantity(Number(ev.target.value))}
          />
          <button
            className="flex bg-gray-200"
            onClick={async () => {
              console.log(product.node.id);

              await mutate({
                variables: {
                  input: {
                    lines: [
                      {
                        quantity,
                        merchandiseId: product.node.id,
                      },
                    ],
                  },
                },
                onCompleted: (data) => {
                  setCartId(data?.cartCreate?.cart?.id);
                },
              });
            }}
          >
            <b>COMPRAR</b>
          </button>
        </a>
      ))}
    </div>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {
      title: "Home",
    },
  };
};
