import {
  discountList,
  priceServiceList,
  ServiceType,
  ServiceYear,
} from "./priceServiceList";
import { updateSelectedServices } from "./serviceManager";
import { DiscountContext } from "./discountContext";

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  if (selectedServices.length === 0) {
    return { basePrice: 0, finalPrice: 0 };
  }
  if (!Object.keys(priceServiceList).includes(selectedYear.toString())) {
    return { basePrice: 0, finalPrice: 0 };
  }
  var currentServicesPricing = priceServiceList[selectedYear];
  var selectedPriceServices = [] as ServiceType[];
  selectedServices.forEach((service) => {
    selectedPriceServices = updateSelectedServices(selectedPriceServices, {
      type: "Select",
      service,
    });
  });

  var basePrice = 0;
  basePrice = selectedPriceServices.reduce((acc, service) => {
    return acc + currentServicesPricing[service].basePrice;
  }, 0);

  var finalPrice = discountStrategy(
    selectedPriceServices,
    currentServicesPricing,
    Object.keys(discountList).includes(selectedYear.toString())
      ? discountList[selectedYear]
      : null,
    basePrice
  );
  return { basePrice, finalPrice };
};

const discountStrategy = (
  selectedServices: ServiceType[],
  currentServicesPricing: any,
  discountList: any,
  basePrice: number
) => {
  
  if (!discountList || (selectedServices?.length ?? 0) === 0) {
    console.log("❌ No discounts applied - returning base price");
    return basePrice;
  }

  var finalPrice = 0;
  var updatedPricingforServices: any = {};
  Object.keys(currentServicesPricing).forEach(key => {
    updatedPricingforServices[key] = { ...currentServicesPricing[key] };
  });
  
  const discountContext = new DiscountContext();
  discountContext.applyDiscounts(selectedServices, updatedPricingforServices, discountList);

  finalPrice += selectedServices.reduce((acc, service) => {
    return acc + updatedPricingforServices[service].basePrice;
  }, 0);
  
  return finalPrice > basePrice ? basePrice : finalPrice;
};