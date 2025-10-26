import { updateSelectedServices } from "./serviceManager";
import { ServiceType } from "./priceServiceList";

describe("ServiceManager", () => {
  describe("updateSelectedServices - Select Operations", () => {
    test("should select a service when it's not already selected", () => {
      const result = updateSelectedServices([], { type: "Select", service: "Photography" });
      expect(result).toEqual(["Photography"]);
    });

    test("should not duplicate a service that's already selected", () => {
      const result = updateSelectedServices(["Photography"], { type: "Select", service: "Photography" });
      expect(result).toEqual(["Photography"]);
    });

    test("should select independent services without restrictions", () => {
      const result = updateSelectedServices(["Photography"], { type: "Select", service: "WeddingSession" });
      expect(result).toEqual(["Photography", "WeddingSession"]);
    });

    describe("Dependent Service Selection", () => {
      test("should select BlurayPackage when VideoRecording is already selected", () => {
        const result = updateSelectedServices(["VideoRecording"], { type: "Select", service: "BlurayPackage" });
        expect(result).toEqual(["VideoRecording", "BlurayPackage"]);
      });

      test("should not select BlurayPackage when VideoRecording is not selected", () => {
        const result = updateSelectedServices(["Photography"], { type: "Select", service: "BlurayPackage" });
        expect(result).toEqual(["Photography"]);
      });

      test("should not select BlurayPackage when no services are selected", () => {
        const result = updateSelectedServices([], { type: "Select", service: "BlurayPackage" });
        expect(result).toEqual([]);
      });

      test("should select TwoDayEvent when Photography is selected", () => {
        const result = updateSelectedServices(["Photography"], { type: "Select", service: "TwoDayEvent" });
        expect(result).toEqual(["Photography", "TwoDayEvent"]);
      });

      test("should select TwoDayEvent when VideoRecording is selected", () => {
        const result = updateSelectedServices(["VideoRecording"], { type: "Select", service: "TwoDayEvent" });
        expect(result).toEqual(["VideoRecording", "TwoDayEvent"]);
      });

      test("should select TwoDayEvent when both Photography and VideoRecording are selected", () => {
        const result = updateSelectedServices(["Photography", "VideoRecording"], { type: "Select", service: "TwoDayEvent" });
        expect(result).toEqual(["Photography", "VideoRecording", "TwoDayEvent"]);
      });

      test("should not select TwoDayEvent when neither Photography nor VideoRecording is selected", () => {
        const result = updateSelectedServices(["WeddingSession"], { type: "Select", service: "TwoDayEvent" });
        expect(result).toEqual(["WeddingSession"]);
      });

      test("should not select TwoDayEvent when no services are selected", () => {
        const result = updateSelectedServices([], { type: "Select", service: "TwoDayEvent" });
        expect(result).toEqual([]);
      });
    });

    describe("Complex Selection Scenarios", () => {
      test("should handle multiple dependent services with one main service", () => {
        let services = updateSelectedServices(["VideoRecording"], { type: "Select", service: "BlurayPackage" });
        services = updateSelectedServices(services, { type: "Select", service: "TwoDayEvent" });
        expect(services).toEqual(["VideoRecording", "BlurayPackage", "TwoDayEvent"]);
      });

      test("should handle selecting main service after attempting dependent service", () => {
        let services = updateSelectedServices([], { type: "Select", service: "BlurayPackage" });
        expect(services).toEqual([]);
        
        services = updateSelectedServices(services, { type: "Select", service: "VideoRecording" });
        expect(services).toEqual(["VideoRecording"]);
        
        services = updateSelectedServices(services, { type: "Select", service: "BlurayPackage" });
        expect(services).toEqual(["VideoRecording", "BlurayPackage"]);
      });
    });
  });

  describe("updateSelectedServices - Deselect Operations", () => {
    test("should deselect a service when it's selected", () => {
      const result = updateSelectedServices(["Photography", "WeddingSession"], { type: "Deselect", service: "Photography" });
      expect(result).toEqual(["WeddingSession"]);
    });

    test("should do nothing when deselecting a service that's not selected", () => {
      const result = updateSelectedServices(["Photography"], { type: "Deselect", service: "VideoRecording" });
      expect(result).toEqual(["Photography"]);
    });

    test("should deselect from empty array without errors", () => {
      const result = updateSelectedServices([], { type: "Deselect", service: "Photography" });
      expect(result).toEqual([]);
    });

    describe("Dependent Service Deselection", () => {
      test("should deselect BlurayPackage when VideoRecording is deselected", () => {
        const result = updateSelectedServices(["VideoRecording", "BlurayPackage"], { type: "Deselect", service: "VideoRecording" });
        expect(result).toEqual([]);
      });

      test("should deselect TwoDayEvent when Photography is deselected (and VideoRecording not present)", () => {
        const result = updateSelectedServices(["Photography", "TwoDayEvent"], { type: "Deselect", service: "Photography" });
        expect(result).toEqual([]);
      });

      test("should deselect TwoDayEvent when VideoRecording is deselected (and Photography not present)", () => {
        const result = updateSelectedServices(["VideoRecording", "TwoDayEvent"], { type: "Deselect", service: "VideoRecording" });
        expect(result).toEqual([]);
      });

      test("should not deselect TwoDayEvent when Photography is deselected but VideoRecording remains", () => {
        const result = updateSelectedServices(["Photography", "VideoRecording", "TwoDayEvent"], { type: "Deselect", service: "Photography" });
        expect(result).toEqual(["VideoRecording", "TwoDayEvent"]);
      });

      test("should not deselect TwoDayEvent when VideoRecording is deselected but Photography remains", () => {
        const result = updateSelectedServices(["Photography", "VideoRecording", "TwoDayEvent"], { type: "Deselect", service: "VideoRecording" });
        expect(result).toEqual(["Photography", "TwoDayEvent"]);
      });
    });

    describe("Complex Deselection Scenarios", () => {
      test("should handle cascading deselections", () => {
        const result = updateSelectedServices(
          ["VideoRecording", "BlurayPackage", "TwoDayEvent", "Photography"], 
          { type: "Deselect", service: "VideoRecording" }
        );
        expect(result).toEqual(["TwoDayEvent", "Photography"]);
      });

      test("should handle deselecting when multiple dependencies exist", () => {
        let services: ServiceType[] = ["Photography", "VideoRecording", "BlurayPackage", "TwoDayEvent"];
        
        services = updateSelectedServices(services, { type: "Deselect", service: "Photography" });
        expect(services).toEqual(["VideoRecording", "BlurayPackage", "TwoDayEvent"]);
        
        services = updateSelectedServices(services, { type: "Deselect", service: "VideoRecording" });
        expect(services).toEqual([]);
      });

      test("should handle deselecting independent services without affecting dependents", () => {
        const result = updateSelectedServices(
          ["Photography", "VideoRecording", "WeddingSession", "BlurayPackage", "TwoDayEvent"], 
          { type: "Deselect", service: "WeddingSession" }
        );
        expect(result).toEqual(["Photography", "VideoRecording", "BlurayPackage", "TwoDayEvent"]);
      });
    });

    describe("Edge Cases and Service Dependencies", () => {
      test("should maintain service order when deselecting", () => {
        const result = updateSelectedServices(
          ["WeddingSession", "Photography", "VideoRecording"], 
          { type: "Deselect", service: "Photography" }
        );
        expect(result).toEqual(["WeddingSession", "VideoRecording"]);
      });

      test("should handle deselecting services with multiple dependents", () => {
        const result = updateSelectedServices(
          ["VideoRecording", "BlurayPackage", "TwoDayEvent"], 
          { type: "Deselect", service: "VideoRecording" }
        );
        expect(result).toEqual([]);
      });

      test("should handle empty dependent relationships correctly", () => {
        const result = updateSelectedServices(["WeddingSession"], { type: "Deselect", service: "WeddingSession" });
        expect(result).toEqual([]);
      });
    });
  });

  describe("updateSelectedServices - State Immutability", () => {
    test("should not modify the original array", () => {
      const originalServices: ServiceType[] = ["Photography"];
      const result = updateSelectedServices(originalServices, { type: "Select", service: "VideoRecording" });
      
      expect(originalServices).toEqual(["Photography"]);
      expect(result).toEqual(["Photography", "VideoRecording"]);
      expect(result).not.toBe(originalServices);
    });

    test("should return a new array even when no changes are made", () => {
      const originalServices: ServiceType[] = ["Photography"];
      const result = updateSelectedServices(originalServices, { type: "Select", service: "Photography" });
      
      expect(result).toEqual(["Photography"]);
      expect(result).not.toBe(originalServices);
    });
  });

  describe("updateSelectedServices - Integration with Product Selection Rules", () => {
    test("should respect the defined product selection rules for BlurayPackage", () => {
      const withoutDep = updateSelectedServices([], { type: "Select", service: "BlurayPackage" });
      expect(withoutDep).toEqual([]);
      
      const withDep = updateSelectedServices(["VideoRecording"], { type: "Select", service: "BlurayPackage" });
      expect(withDep).toEqual(["VideoRecording", "BlurayPackage"]);
    });

    test("should respect the defined product selection rules for TwoDayEvent", () => {
      const withPhotography = updateSelectedServices(["Photography"], { type: "Select", service: "TwoDayEvent" });
      expect(withPhotography).toEqual(["Photography", "TwoDayEvent"]);
      
      const withVideoRecording = updateSelectedServices(["VideoRecording"], { type: "Select", service: "TwoDayEvent" });
      expect(withVideoRecording).toEqual(["VideoRecording", "TwoDayEvent"]);
      
      const withoutEither = updateSelectedServices(["WeddingSession"], { type: "Select", service: "TwoDayEvent" });
      expect(withoutEither).toEqual(["WeddingSession"]);
    });
  });
});