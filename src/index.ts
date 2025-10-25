import {
  discountList,
  priceServiceList,
  productSelectionRules,
  ServiceType,
  ServiceYear,
} from "./priceServiceList";

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
  const updatedServices = [...previouslySelectedServices];
  switch (action.type) {
    case "Select":
      if (!updatedServices.includes(action.service)) {
        const related = productSelectionRules.requiredServices[action.service];
        if (related) {
          const isMainServiceSelected = related.some((mainService) =>
            updatedServices.includes(mainService)
          );
          if (isMainServiceSelected) {
            updatedServices.push(action.service);
          }
        } else {
          updatedServices.push(action.service);
        }
      }
      break;
    case "Deselect":
      var deletedServices = deselectService(action.service, updatedServices);
      if (deletedServices?.length > 0) {
        var relatedServices = Object.keys(
          productSelectionRules.requiredServices
        ).filter((key) => {
          const mains =
            productSelectionRules.requiredServices[key as ServiceType];
          return (
            mains?.includes(action.service) &&
            !updatedServices.some((s) => mains.includes(s))
          );
        }) as ServiceType[];
        relatedServices.forEach((relatedService) => {
          deselectService(relatedService, updatedServices);
        });
      }

      break;
  }
  return updatedServices;
};

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
  
  // Apply Photography + VideoRecording discount (highest priority)
  if (
    selectedServices.includes("Photography") &&
    selectedServices.includes("VideoRecording")
  ) {
    if (
      updatedPricingforServices["Photography"].basePrice +
        updatedPricingforServices["VideoRecording"].basePrice >
      discountList["PhotographyAndVideoRecording"].basePrice
    ) {
      updatedPricingforServices["Photography"].basePrice =
        discountList["PhotographyAndVideoRecording"].basePrice;
      updatedPricingforServices["VideoRecording"].basePrice = 0;
    }
  }

  //WeddingSessionWithPhotographyOrVideoRecording
  if (
    selectedServices.includes("WeddingSession") &&
    (selectedServices.includes("Photography") ||
      selectedServices.includes("VideoRecording"))
  ) {
    if (
      updatedPricingforServices["WeddingSession"].basePrice >
      discountList["WeddingSessionWithPhotographyOrVideoRecording"].basePrice
    ) {
      updatedPricingforServices["WeddingSession"].basePrice =
        discountList["WeddingSessionWithPhotographyOrVideoRecording"].basePrice;
        console.log(`applied WeddingSessionWithPhotographyOrVideoRecording discount ${updatedPricingforServices["WeddingSession"].basePrice}`);
    }
  }

  //WeddingSessionWithPhotography
  if (
    selectedServices.includes("WeddingSession") &&
    selectedServices.includes("Photography")
  ) {
    if (
      updatedPricingforServices["WeddingSession"].basePrice >
      discountList["WeddingSessionWithPhotography"].basePrice
    ) {
      updatedPricingforServices["WeddingSession"].basePrice =
        discountList["WeddingSessionWithPhotography"].basePrice;
    }
  }

  finalPrice += selectedServices.reduce((acc, service) => {
    return acc + updatedPricingforServices[service].basePrice;
  }, 0);
  
  return finalPrice > basePrice ? basePrice : finalPrice;
};

const deselectService = (
  service: ServiceType,
  updatedServices: ServiceType[]
) => {
  const idx = updatedServices.indexOf(service);
  if (idx > -1) {
    return updatedServices.splice(idx, 1);
  }
};
