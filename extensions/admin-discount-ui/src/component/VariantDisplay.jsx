import { Box, InlineStack, Text, Image } from "@shopify/ui-extensions-react/admin";

export default function VariantDisplay({ variant }) {
  const imageUrl = variant?.image?.url || variant?.product?.featuredImage?.url;

  return (
    <InlineStack spacing="base">
      <Box border="base" padding="base">
        <Text>{variant.product.title} / {variant.title}</Text>
      </Box>
      {imageUrl && (
        <Box border="base" padding="base">
          <Image
            source={imageUrl}
            description={variant.title}
            width={20}
            resolution="2"
          />
        </Box>
      )}
    </InlineStack>
  );
}
