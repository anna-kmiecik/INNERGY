import { ServiceType } from "./priceServiceList";
import { 
  DiscountStrategyInterface,
  PhotographyAndVideoRecordingDiscountStrategy,
  WeddingSessionWithPhotographyOrVideoRecordingDiscountStrategy,
  WeddingSessionWithPhotographyDiscountStrategy
} from "./discountStrategies";

export class DiscountContext {
  private strategies: DiscountStrategyInterface[] = [
    new PhotographyAndVideoRecordingDiscountStrategy(),
    new WeddingSessionWithPhotographyOrVideoRecordingDiscountStrategy(),
    new WeddingSessionWithPhotographyDiscountStrategy()
  ];

  applyDiscounts(
    selectedServices: ServiceType[],
    updatedPricingforServices: any,
    discountList: any
  ): void {
    this.strategies.forEach(strategy => {
      if (strategy.isApplicable(selectedServices)) {
        strategy.apply(selectedServices, updatedPricingforServices, discountList);
      }
    });
  }
}