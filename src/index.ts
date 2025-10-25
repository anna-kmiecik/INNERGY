// Re-export functions from modular files
export { updateSelectedServices } from "./serviceManager";
export { calculatePrice } from "./priceCalculator";

// Re-export types and data for backward compatibility
export type {
  ServiceType,
  ServiceYear,
  DiscountType,
  PriceServiceContext,
  PriceServiceList,
  DiscountList
} from "./priceServiceList";

export {
  priceServiceList,
  discountList,
  productSelectionRules
} from "./priceServiceList";

// Re-export discount strategies and context for potential external use
export type { DiscountStrategyInterface } from "./discountStrategies";
export {
  PhotographyAndVideoRecordingDiscountStrategy,
  WeddingSessionWithPhotographyOrVideoRecordingDiscountStrategy,
  WeddingSessionWithPhotographyDiscountStrategy
} from "./discountStrategies";
export { DiscountContext } from "./discountContext";
