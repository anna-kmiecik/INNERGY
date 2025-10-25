import { ServiceType } from "./priceServiceList";

export interface DiscountStrategyInterface {
  apply(
    selectedServices: ServiceType[],
    updatedPricingforServices: any,
    discountList: any
  ): void;
  isApplicable(selectedServices: ServiceType[]): boolean;
}

// Photography + VideoRecording discount (highest priority) --> order by priority
export class PhotographyAndVideoRecordingDiscountStrategy implements DiscountStrategyInterface {
  isApplicable(selectedServices: ServiceType[]): boolean {
    return selectedServices.includes("Photography") && 
           selectedServices.includes("VideoRecording");
  }

  apply(
    selectedServices: ServiceType[],
    updatedPricingforServices: any,
    discountList: any
  ): void {
    if (
      updatedPricingforServices["Photography"].basePrice +
        updatedPricingforServices["VideoRecording"].basePrice >
      discountList["PhotographyAndVideoRecording"].basePrice
    ) {
      updatedPricingforServices["Photography"].basePrice =
        discountList["PhotographyAndVideoRecording"].basePrice;
      updatedPricingforServices["VideoRecording"].basePrice = 0;
      console.log(`Applied PhotographyAndVideoRecording discount: ${discountList["PhotographyAndVideoRecording"].basePrice}`);
    }
  }
}

// WeddingSessionWithPhotographyOrVideoRecording
export class WeddingSessionWithPhotographyOrVideoRecordingDiscountStrategy implements DiscountStrategyInterface {
  isApplicable(selectedServices: ServiceType[]): boolean {
    return selectedServices.includes("WeddingSession") &&
           (selectedServices.includes("Photography") ||
            selectedServices.includes("VideoRecording"));
  }

  apply(
    selectedServices: ServiceType[],
    updatedPricingforServices: any,
    discountList: any
  ): void {
    if (
      updatedPricingforServices["WeddingSession"].basePrice >
      discountList["WeddingSessionWithPhotographyOrVideoRecording"].basePrice
    ) {
      updatedPricingforServices["WeddingSession"].basePrice =
        discountList["WeddingSessionWithPhotographyOrVideoRecording"].basePrice;
      console.log(`Applied WeddingSessionWithPhotographyOrVideoRecording discount: ${updatedPricingforServices["WeddingSession"].basePrice}`);
    }
  }
}

// WeddingSessionWithPhotography
export class WeddingSessionWithPhotographyDiscountStrategy implements DiscountStrategyInterface {
  isApplicable(selectedServices: ServiceType[]): boolean {
    return selectedServices.includes("WeddingSession") &&
           selectedServices.includes("Photography");
  }

  apply(
    selectedServices: ServiceType[],
    updatedPricingforServices: any,
    discountList: any
  ): void {
    if (
      updatedPricingforServices["WeddingSession"].basePrice >
      discountList["WeddingSessionWithPhotography"].basePrice
    ) {
      updatedPricingforServices["WeddingSession"].basePrice =
        discountList["WeddingSessionWithPhotography"].basePrice;
      console.log(`Applied WeddingSessionWithPhotography discount: ${updatedPricingforServices["WeddingSession"].basePrice}`);
    }
  }
}