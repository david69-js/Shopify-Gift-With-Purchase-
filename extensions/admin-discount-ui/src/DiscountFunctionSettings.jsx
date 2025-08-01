import { reactExtension } from "@shopify/ui-extensions-react/admin";
import App from "./App.jsx";
import {
  getMetafieldDefinition,
  createMetafieldDefinition,
} from "./metafield";

const TARGET = "admin.discount-details.function-settings.render";

export default reactExtension(TARGET, async (api) => {
  const existingDefinition = await getMetafieldDefinition(api.query);
  if (!existingDefinition) {
    const created = await createMetafieldDefinition(api.query);
    if (!created) throw new Error("Failed to create metafield definition");
  }

  return <App />;
});
