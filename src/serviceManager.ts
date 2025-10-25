import { ServiceType } from "./priceServiceList";
import { productSelectionRules } from "./priceServiceList";

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

const deselectService = (
  service: ServiceType,
  updatedServices: ServiceType[]
) => {
  const idx = updatedServices.indexOf(service);
  if (idx > -1) {
    return updatedServices.splice(idx, 1);
  }
};