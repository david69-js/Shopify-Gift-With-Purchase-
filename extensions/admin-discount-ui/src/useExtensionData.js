import { useApi } from "@shopify/ui-extensions-react/admin";
import { useEffect, useMemo, useState } from "react";
import { parseMetafield } from "./metafield";

const TARGET = "admin.discount-details.function-settings.render";
const METAFIELD_NAMESPACE = "$app:discount-ui-gwp";
const METAFIELD_KEY = "gwp-parks";

export function useExtensionData() {
  const { applyMetafieldChange, i18n, data, resourcePicker, query } = useApi(TARGET);

  const metafieldConfig = useMemo(() => parseMetafield(
    data?.metafields.find((m) => m.key === METAFIELD_KEY)?.value
  ), [data?.metafields]);

  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cartThreshold, setCartThreshold] = useState(metafieldConfig.cartThreshold ?? 0);
  const [enableFreeGift, setEnableFreeGift] = useState(!!metafieldConfig.enableFreeGift);

  useEffect(() => {
    if (!metafieldConfig.variantId) return;
    const queryStr = `#graphql
      query GetVariant($id: ID!) {
        node(id: $id) {
          ... on ProductVariant {
            id title image { url } product { title featuredImage { url } }
          }
        }
      }
    `;
    query(queryStr, { variables: { id: metafieldConfig.variantId } })
      .then((result) => result?.data?.node && setSelectedVariant(result.data.node));
  }, [metafieldConfig.variantId, query]);

  const applyExtensionMetafieldChange = async ({ variant } = {}) => {
    const variantToSave = variant || selectedVariant;
    await applyMetafieldChange({
      type: "updateMetafield",
      namespace: METAFIELD_NAMESPACE,
      key: METAFIELD_KEY,
      value: JSON.stringify({
        variantId: variantToSave?.id || null,
        cartThreshold: Number(cartThreshold),
        enableFreeGift,
      }),
      valueType: "json",
    });
  };

  const resetForm = () => {
    setCartThreshold(metafieldConfig.cartThreshold ?? 0);
    setEnableFreeGift(!!metafieldConfig.enableFreeGift);
  };

  const onSelectVariant = async () => {
    const selection = await resourcePicker({
      type: "variant",
      selectMultiple: false,
    });

    if (selection?.[0]) {
      const variantId = selection[0].id;
      const queryStr = `#graphql
        query GetVariantDetails($id: ID!) {
          node(id: $id) {
            ... on ProductVariant {
              id title image { url } product { title }
            }
          }
        }
      `;
      const result = await query(queryStr, { variables: { id: variantId } });
      if (result?.data?.node) {
        setSelectedVariant(result.data.node);
        await applyExtensionMetafieldChange({ variant: result.data.node });
      }
    }
  };

  return {
    applyExtensionMetafieldChange,
    i18n,
    loading,
    selectedVariant,
    onSelectVariant,
    cartThreshold,
    setCartThreshold,
    enableFreeGift,
    setEnableFreeGift,
    resetForm,
  };
}
