import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
} from '../generated/api';

/**
  * @typedef {import("../generated/api").CartInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  const cart = input.cart;
  const discountClasses = input.discount.discountClasses || [];
  const hasProductDiscountClass = discountClasses.includes(DiscountClass.Product);

  let config = {};
  try {
    config = JSON.parse(input?.discount?.metafield?.value || '{}');
  } catch (e) {
    return {operations: []};
  }

  const {variantId, cartThreshold, enableFreeGift} = config;
  if (!hasProductDiscountClass || !enableFreeGift || !variantId || isNaN(cartThreshold)) {
    return {operations: []};
  }

  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  if (subtotal < cartThreshold) {
    return {operations: []};
  }

  const giftLines = cart.lines.filter(line => line.merchandise?.id === variantId);

  if (!giftLines.length) {
    return {operations: []};
  }

  const currencyCode = cart.cost.subtotalAmount.currencyCode;
  if(currencyCode !== 'USD') {
    return {operations: []};
  }

  let targetLine = null;
  for (const line of giftLines) {
    if (line.quantity >= 1) {
      targetLine = line;
      break;
    }
  }
  if (!targetLine) {
    return {operations: []};
  }


  return {
    operations: [
      {
        productDiscountsAdd: {
          candidates: [
            {
              message: "¡FREE GIFT!",
              targets: [
                {
                  cartLine: {
                    id: targetLine.id,
                    quantity: 1,
                  },
                },
              ],
              value: {
                percentage: {
                  value: 100,
                },
              },
            },
          ],
          selectionStrategy: ProductDiscountSelectionStrategy.First,
        },
      },
    ],
  };
}