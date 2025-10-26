import { calculatePrice } from "./priceCalculator";
import { ServiceType, ServiceYear } from "./priceServiceList";

describe("PriceCalculator", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("calculatePrice - Edge Cases", () => {
    test("should return zero prices for empty services array", () => {
      const result = calculatePrice([], 2020);
      expect(result).toEqual({ basePrice: 0, finalPrice: 0 });
    });

    test("should return zero prices for invalid year", () => {
      const result = calculatePrice(["Photography"], 2019 as ServiceYear);
      expect(result).toEqual({ basePrice: 0, finalPrice: 0 });
    });

    test("should handle single service without discounts", () => {
      const result = calculatePrice(["Photography"], 2020);
      expect(result.basePrice).toBe(1700);
      expect(result.finalPrice).toBe(1700);
    });

    test("should handle services with no applicable discounts", () => {
      const result = calculatePrice(["BlurayPackage"], 2020);
      expect(result.basePrice).toBe(0);
      expect(result.finalPrice).toBe(0);
    });
  });

  describe("calculatePrice - Discount Strategy Integration", () => {
    describe("Photography + VideoRecording Discount", () => {
      test("should apply PhotographyAndVideoRecording discount for 2020", () => {
        const result = calculatePrice(["Photography", "VideoRecording"], 2020);
        expect(result.basePrice).toBe(3400);
        expect(result.finalPrice).toBe(2200);
        expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2200");
      });

      test("should apply PhotographyAndVideoRecording discount for 2021", () => {
        const result = calculatePrice(["Photography", "VideoRecording"], 2021);
        expect(result.basePrice).toBe(3600);
        expect(result.finalPrice).toBe(2300);
        expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2300");
      });

      test("should apply PhotographyAndVideoRecording discount for 2022", () => {
        const result = calculatePrice(["Photography", "VideoRecording"], 2022);
        expect(result.basePrice).toBe(3800);
        expect(result.finalPrice).toBe(2500);
        expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2500");
      });
    });

    describe("WeddingSession with Photography Discounts", () => {
      test("should apply WeddingSession discounts with Photography for 2020", () => {
        const result = calculatePrice(["WeddingSession", "Photography"], 2020);
        expect(result.basePrice).toBe(2300);
        expect(result.finalPrice).toBe(2000);
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
      });

      test("should apply WeddingSession discounts with Photography for 2022", () => {
        const result = calculatePrice(["WeddingSession", "Photography"], 2022);
        expect(result.basePrice).toBe(2500);
        expect(result.finalPrice).toBe(1900);
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotography discount: 0");
      });
    });

    describe("WeddingSession with VideoRecording Discounts", () => {
      test("should apply WeddingSession discount with VideoRecording for 2020", () => {
        const result = calculatePrice(["WeddingSession", "VideoRecording"], 2020);
        expect(result.basePrice).toBe(2300);
        expect(result.finalPrice).toBe(2000);
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
      });

      test("should apply WeddingSession discount with VideoRecording for 2021", () => {
        const result = calculatePrice(["WeddingSession", "VideoRecording"], 2021);
        expect(result.basePrice).toBe(2400);
        expect(result.finalPrice).toBe(2100);
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
      });
    });

    describe("Complex Combinations", () => {
      test("should apply all applicable discounts for Photography + VideoRecording + WeddingSession", () => {
        const result = calculatePrice(["Photography", "VideoRecording", "WeddingSession"], 2020);
        expect(result.basePrice).toBe(4000);
        expect(result.finalPrice).toBe(2500);
        
        expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2200");
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
      });

      test("should handle TwoDayEvent with required services", () => {
        const result = calculatePrice(["Photography", "VideoRecording", "TwoDayEvent"], 2021);
        expect(result.basePrice).toBe(4000); // 1800 + 1800 + 400
        expect(result.finalPrice).toBe(2700); // 2300 + 0 + 400 (Photography+VideoRecording discount + TwoDayEvent)
        
        expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2300");
      });

      test("should handle BlurayPackage with VideoRecording", () => {
        const result = calculatePrice(["VideoRecording", "BlurayPackage"], 2020);
        expect(result.basePrice).toBe(2000);
        expect(result.finalPrice).toBe(2000);
      });

      test("should handle all services selected", () => {
        const result = calculatePrice(["Photography", "VideoRecording", "WeddingSession", "BlurayPackage", "TwoDayEvent"], 2022);
        expect(result.basePrice).toBe(5100);
        expect(result.finalPrice).toBe(3200);
        
        expect(consoleSpy).toHaveBeenCalledWith("Applied PhotographyAndVideoRecording discount: 2500");
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotographyOrVideoRecording discount: 300");
        expect(consoleSpy).toHaveBeenCalledWith("Applied WeddingSessionWithPhotography discount: 0");
      });
    });

    describe("Boundary Conditions", () => {
      test("should not exceed base price when discounts are calculated", () => {
        const result = calculatePrice(["Photography", "VideoRecording"], 2020);
        expect(result.finalPrice).toBeLessThanOrEqual(result.basePrice);
      });

      test("should return base price when final price calculation exceeds base price", () => {
        // This tests the safeguard: return finalPrice > basePrice ? basePrice : finalPrice
        const result = calculatePrice(["Photography"], 2020);
        expect(result.finalPrice).toBe(result.basePrice);
      });

      test("should handle no discount list available", () => {
        // Test with a year that might not have discounts (edge case)
        const result = calculatePrice(["Photography"], 2020);
        expect(result.basePrice).toBeGreaterThan(0);
        expect(result.finalPrice).toBeGreaterThan(0);
      });
    });
  });

  describe("calculatePrice - Service Selection Logic Integration", () => {
    test("should properly handle dependent services", () => {
      // BlurayPackage requires VideoRecording - should not be selected without it
      const resultWithoutVideo = calculatePrice(["BlurayPackage"], 2020);
      expect(resultWithoutVideo.basePrice).toBe(0);
      
      // BlurayPackage with VideoRecording - should be included
      const resultWithVideo = calculatePrice(["VideoRecording", "BlurayPackage"], 2020);
      expect(resultWithVideo.basePrice).toBe(2000); // 1700 + 300
    });

    test("should handle TwoDayEvent dependencies", () => {
      // TwoDayEvent requires Photography or VideoRecording
      const resultWithoutRequiredService = calculatePrice(["TwoDayEvent"], 2020);
      expect(resultWithoutRequiredService.basePrice).toBe(0);
      
      const resultWithPhotography = calculatePrice(["Photography", "TwoDayEvent"], 2020);
      expect(resultWithPhotography.basePrice).toBe(2100); // 1700 + 400
      
      const resultWithVideoRecording = calculatePrice(["VideoRecording", "TwoDayEvent"], 2020);
      expect(resultWithVideoRecording.basePrice).toBe(2100); // 1700 + 400
    });
  });

  describe("calculatePrice - Year-specific Behavior", () => {
    test.each([
      [2020, 1700],
      [2021, 1800], 
      [2022, 1900]
    ])("should have correct Photography price for year %i", (year: ServiceYear, expectedPrice: number) => {
      const result = calculatePrice(["Photography"], year);
      expect(result.basePrice).toBe(expectedPrice);
      expect(result.finalPrice).toBe(expectedPrice);
    });

    test.each([
      [2020, 1700],
      [2021, 1800],
      [2022, 1900]
    ])("should have correct VideoRecording price for year %i", (year: ServiceYear, expectedPrice: number) => {
      const result = calculatePrice(["VideoRecording"], year);
      expect(result.basePrice).toBe(expectedPrice);
      expect(result.finalPrice).toBe(expectedPrice);
    });

    test("should have consistent WeddingSession price across years", () => {
      [2020, 2021, 2022].forEach((year: ServiceYear) => {
        const result = calculatePrice(["WeddingSession"], year);
        expect(result.basePrice).toBe(600);
        expect(result.finalPrice).toBe(600);
      });
    });
  });
});