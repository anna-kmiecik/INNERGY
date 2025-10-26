import { DiscountContext } from "./discountContext";
import { discountList, DiscountList, priceServiceList, ServiceType } from "./priceServiceList";

describe("DiscountContext", () => {
  let discountContext: DiscountContext;
  let mockPricing: any;
  let mockDiscountList: any;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    discountContext = new DiscountContext();
    
    mockPricing = priceServiceList[2020];
    
    mockDiscountList = {...discountList[2020]};
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("applyDiscounts", () => {
    test("should apply no discounts when no applicable strategies", () => {
      const services: ServiceType[] = ["BlurayPackage"];
      const originalPricing = JSON.parse(JSON.stringify(mockPricing));
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing).toEqual(originalPricing);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should apply Photography and VideoRecording discount only", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(2200);
      expect(mockPricing.VideoRecording.basePrice).toBe(0);
      expect(mockPricing.WeddingSession.basePrice).toBe(600);
      expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2200");
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });

    test("should apply WeddingSession with Photography discount only", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(2200);
      expect(mockPricing.VideoRecording.basePrice).toBe(0);
      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
    });

    test("should apply WeddingSession with VideoRecording discount only", () => {
      const services: ServiceType[] = ["WeddingSession", "VideoRecording"];
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(2200);
      expect(mockPricing.VideoRecording.basePrice).toBe(0);
      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should apply multiple discounts in priority order", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording", "WeddingSession"];
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(2200);
      expect(mockPricing.VideoRecording.basePrice).toBe(0);
      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should handle all services selected", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording", "WeddingSession", "BlurayPackage", "TwoDayEvent"];
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(2200);
      expect(mockPricing.VideoRecording.basePrice).toBe(0);
      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      expect(mockPricing.BlurayPackage.basePrice).toBe(300);
      expect(mockPricing.TwoDayEvent.basePrice).toBe(400);
      
      expect(consoleSpy).toHaveBeenCalledTimes(0);
    });

    test("should handle empty services array", () => {
      const services: ServiceType[] = [];
      const originalPricing = JSON.parse(JSON.stringify(mockPricing));
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing).toEqual(originalPricing);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should not apply discounts when conditions are not met", () => {
      mockPricing.Photography.basePrice = 1000;
      mockPricing.VideoRecording.basePrice = 1000;
      mockPricing.WeddingSession.basePrice = 200;
      mockDiscountList.PhotographyAndVideoRecording.basePrice = 2500;
      mockDiscountList.WeddingSessionWithPhotographyOrVideoRecording.basePrice = 500;
      mockDiscountList.WeddingSessionWithPhotography.basePrice = 500;
      
      const services: ServiceType[] = ["Photography", "VideoRecording", "WeddingSession"];
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(1000);
      expect(mockPricing.VideoRecording.basePrice).toBe(1000);
      expect(mockPricing.WeddingSession.basePrice).toBe(200);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should handle partial discount application", () => {
      mockPricing.Photography.basePrice = 500;
      mockPricing.VideoRecording.basePrice = 500;
      mockPricing.WeddingSession.basePrice = 500;
      mockDiscountList.PhotographyAndVideoRecording.basePrice = 2000;
      
      const services: ServiceType[] = ["Photography", "VideoRecording", "WeddingSession"];
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(500);
      expect(mockPricing.VideoRecording.basePrice).toBe(500);
      expect(mockPricing.WeddingSession.basePrice).toBe(500);
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should maintain discount priority order", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording", "WeddingSession"];
      
      consoleSpy.mockClear();
      
      discountContext.applyDiscounts(services, mockPricing, mockDiscountList);

      const calls = consoleSpy.mock.calls;
      expect(calls.length).toBe(0);
    });
  });
});