import {
  DiscountStrategyInterface,
  PhotographyAndVideoRecordingDiscountStrategy,
  WeddingSessionWithPhotographyOrVideoRecordingDiscountStrategy,
  WeddingSessionWithPhotographyDiscountStrategy
} from "./discountStrategies";
import { ServiceType } from "./priceServiceList";

describe("PhotographyAndVideoRecordingDiscountStrategy", () => {
  let strategy: DiscountStrategyInterface;
  
  beforeEach(() => {
    strategy = new PhotographyAndVideoRecordingDiscountStrategy();
  });

  describe("isApplicable", () => {
    test("should return true when both Photography and VideoRecording are selected", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return true when Photography, VideoRecording and other services are selected", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording", "WeddingSession", "BlurayPackage"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return false when only Photography is selected", () => {
      const services: ServiceType[] = ["Photography"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when only VideoRecording is selected", () => {
      const services: ServiceType[] = ["VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when neither Photography nor VideoRecording is selected", () => {
      const services: ServiceType[] = ["WeddingSession", "BlurayPackage"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false with empty services array", () => {
      const services: ServiceType[] = [];
      expect(strategy.isApplicable(services)).toBe(false);
    });
  });

  describe("apply", () => {
    let mockPricing: any;
    let mockDiscountList: any;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      mockPricing = {
        Photography: { basePrice: 1800 },
        VideoRecording: { basePrice: 1800 },
        WeddingSession: { basePrice: 600 }
      };
      
      mockDiscountList = {
        PhotographyAndVideoRecording: { basePrice: 2300 }
      };

      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test("should apply discount when combined price is higher than discount price", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(2300);
      expect(mockPricing.VideoRecording.basePrice).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2300");
    });

    test("should not apply discount when combined price is lower than discount price", () => {
      mockPricing.Photography.basePrice = 1000;
      mockPricing.VideoRecording.basePrice = 1000;
      mockDiscountList.PhotographyAndVideoRecording.basePrice = 2500;
      
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(1000);
      expect(mockPricing.VideoRecording.basePrice).toBe(1000);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should not apply discount when combined price equals discount price", () => {
      mockPricing.Photography.basePrice = 1150;
      mockPricing.VideoRecording.basePrice = 1150;
      mockDiscountList.PhotographyAndVideoRecording.basePrice = 2300;
      
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(1150);
      expect(mockPricing.VideoRecording.basePrice).toBe(1150);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should handle edge case with zero prices", () => {
      mockPricing.Photography.basePrice = 0;
      mockPricing.VideoRecording.basePrice = 0;
      mockDiscountList.PhotographyAndVideoRecording.basePrice = 100;
      
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.Photography.basePrice).toBe(0);
      expect(mockPricing.VideoRecording.basePrice).toBe(0);
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});

describe("WeddingSessionWithPhotographyOrVideoRecordingDiscountStrategy", () => {
  let strategy: DiscountStrategyInterface;
  
  beforeEach(() => {
    strategy = new WeddingSessionWithPhotographyOrVideoRecordingDiscountStrategy();
  });

  describe("isApplicable", () => {
    test("should return true when WeddingSession and Photography are selected", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return true when WeddingSession and VideoRecording are selected", () => {
      const services: ServiceType[] = ["WeddingSession", "VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return true when WeddingSession, Photography and VideoRecording are selected", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography", "VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return true with all services selected", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography", "VideoRecording", "BlurayPackage", "TwoDayEvent"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return false when only WeddingSession is selected", () => {
      const services: ServiceType[] = ["WeddingSession"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when only Photography is selected", () => {
      const services: ServiceType[] = ["Photography"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when only VideoRecording is selected", () => {
      const services: ServiceType[] = ["VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when Photography and VideoRecording are selected but not WeddingSession", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false with empty services array", () => {
      const services: ServiceType[] = [];
      expect(strategy.isApplicable(services)).toBe(false);
    });
  });

  describe("apply", () => {
    let mockPricing: any;
    let mockDiscountList: any;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      mockPricing = {
        Photography: { basePrice: 1800 },
        VideoRecording: { basePrice: 1800 },
        WeddingSession: { basePrice: 600 }
      };
      
      mockDiscountList = {
        WeddingSessionWithPhotographyOrVideoRecording: { basePrice: 300 }
      };

      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test("should apply discount when WeddingSession price is higher than discount price", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
    });

    test("should not apply discount when WeddingSession price is lower than discount price", () => {
      mockPricing.WeddingSession.basePrice = 200;
      
      const services: ServiceType[] = ["WeddingSession", "VideoRecording"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(200);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should not apply discount when WeddingSession price equals discount price", () => {
      mockPricing.WeddingSession.basePrice = 300;
      
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should work with both Photography and VideoRecording selected", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography", "VideoRecording"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
    });

    test("should handle edge case with zero discount price", () => {
      mockDiscountList.WeddingSessionWithPhotographyOrVideoRecording.basePrice = 0;
      
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 0");
    });
  });
});

describe("WeddingSessionWithPhotographyDiscountStrategy", () => {
  let strategy: DiscountStrategyInterface;
  
  beforeEach(() => {
    strategy = new WeddingSessionWithPhotographyDiscountStrategy();
  });

  describe("isApplicable", () => {
    test("should return true when both WeddingSession and Photography are selected", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return true when WeddingSession, Photography and other services are selected", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography", "VideoRecording", "BlurayPackage"];
      expect(strategy.isApplicable(services)).toBe(true);
    });

    test("should return false when only WeddingSession is selected", () => {
      const services: ServiceType[] = ["WeddingSession"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when only Photography is selected", () => {
      const services: ServiceType[] = ["Photography"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when WeddingSession and VideoRecording are selected but not Photography", () => {
      const services: ServiceType[] = ["WeddingSession", "VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false when Photography and VideoRecording are selected but not WeddingSession", () => {
      const services: ServiceType[] = ["Photography", "VideoRecording"];
      expect(strategy.isApplicable(services)).toBe(false);
    });

    test("should return false with empty services array", () => {
      const services: ServiceType[] = [];
      expect(strategy.isApplicable(services)).toBe(false);
    });
  });

  describe("apply", () => {
    let mockPricing: any;
    let mockDiscountList: any;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      mockPricing = {
        Photography: { basePrice: 1800 },
        VideoRecording: { basePrice: 1800 },
        WeddingSession: { basePrice: 600 }
      };
      
      mockDiscountList = {
        WeddingSessionWithPhotography: { basePrice: 400 }
      };

      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test("should apply discount when WeddingSession price is higher than discount price", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(400);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotography discount: 400");
    });

    test("should not apply discount when WeddingSession price is lower than discount price", () => {
      mockPricing.WeddingSession.basePrice = 300;
      
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(300);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should not apply discount when WeddingSession price equals discount price", () => {
      mockPricing.WeddingSession.basePrice = 400;
      
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(400);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test("should work when VideoRecording is also selected", () => {
      const services: ServiceType[] = ["WeddingSession", "Photography", "VideoRecording"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(400);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotography discount: 400");
    });

    test("should handle edge case with zero discount price", () => {
      mockDiscountList.WeddingSessionWithPhotography.basePrice = 0;
      
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotography discount: 0");
    });

    test("should handle negative discount price", () => {
      mockDiscountList.WeddingSessionWithPhotography.basePrice = -100;
      
      const services: ServiceType[] = ["WeddingSession", "Photography"];
      
      strategy.apply(services, mockPricing, mockDiscountList);

      expect(mockPricing.WeddingSession.basePrice).toBe(-100);
      expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotography discount: -100");
    });
  });
});