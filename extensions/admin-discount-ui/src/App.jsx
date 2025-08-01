import {
    FunctionSettings,
    Form,
    Section,
    BlockStack,
    Button,
    NumberField,
    Checkbox,
    Text,
  } from "@shopify/ui-extensions-react/admin";
  
    import { useExtensionData } from "./useExtensionData";
    import VariantDisplay from "./component/VariantDisplay.jsx";
  
  export default function App() {
    const {
      i18n,
      loading,
      selectedVariant,
      cartThreshold,
      enableFreeGift,
      setCartThreshold,
      setEnableFreeGift,
      applyExtensionMetafieldChange,
      resetForm,
      onSelectVariant,
    } = useExtensionData();
  
    if (loading) return <Text>{i18n.translate("loading")}</Text>;
  
    return (
      <FunctionSettings onSave={applyExtensionMetafieldChange}>
        <Form onReset={resetForm} onSubmit={applyExtensionMetafieldChange}>
          <Section>
            <BlockStack gap="base">
              <Button onClick={onSelectVariant}>
                {selectedVariant ? "Edit Selected Variant" : "Select Variant"}
              </Button>
              {selectedVariant && <VariantDisplay variant={selectedVariant} />}
              <NumberField
                label="Cart Threshold"
                name="cartThreshold"
                value={cartThreshold}
                onChange={setCartThreshold}
              />
              <Checkbox
                label="Enable Free Gift"
                name="enableFreeGift"
                checked={enableFreeGift}
                onChange={setEnableFreeGift}
              />
            </BlockStack>
          </Section>
        </Form>
      </FunctionSettings>
    );
  }
  