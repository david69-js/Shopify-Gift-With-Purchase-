const METAFIELD_NAMESPACE = "$app:discount-ui-gwp";
const METAFIELD_KEY = "gwp-parks";

export async function getMetafieldDefinition(adminApiQuery) {
  const query = `#graphql
    query {
      metafieldDefinitions(first: 1, ownerType: DISCOUNT, namespace: "${METAFIELD_NAMESPACE}", key: "${METAFIELD_KEY}") {
        nodes { id }
      }
    }
  `;
  const result = await adminApiQuery(query);
  return result?.data?.metafieldDefinitions?.nodes[0];
}

export async function createMetafieldDefinition(adminApiQuery) {
  const definition = {
    access: { admin: "MERCHANT_READ_WRITE" },
    key: METAFIELD_KEY,
    name: "Discount Configuration",
    namespace: METAFIELD_NAMESPACE,
    ownerType: "DISCOUNT",
    type: "json",
  };
  const query = `#graphql
    mutation ($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id }
      }
    }
  `;
  const result = await adminApiQuery(query, { variables: { definition } });
  return result?.data?.metafieldDefinitionCreate?.createdDefinition;
}

export function parseMetafield(value) {
  try {
    const parsed = JSON.parse(value || "{}");
    return {
      variantId: parsed.variantId ?? null,
      cartThreshold: parsed.cartThreshold ?? 0,
      enableFreeGift: !!parsed.enableFreeGift,
    };
  } catch {
    return { variantId: null, cartThreshold: 0, enableFreeGift: false };
  }
}
