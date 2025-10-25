export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

export type DiscountType = "PhotographyAndVideoRecording" | "WeddingSessionWithPhotographyOrVideoRecording" | "WeddingSessionWithPhotography";

export type PriceServiceContext= {
    year: ServiceYear;
    type: ServiceType;
    basePrice: number;
    finalPrice: number;
};

export type PriceServiceList= {
    [key in ServiceYear]: {
        [key in ServiceType]: { basePrice: number;};
    };
};

export const priceServiceList: PriceServiceList = {
    2020: {
        Photography: { basePrice: 1700 },   
        VideoRecording: { basePrice: 1700 },
        BlurayPackage: { basePrice: 300 },
        TwoDayEvent: { basePrice: 400 },
        WeddingSession: { basePrice: 600 },
    },
    2021: {
        Photography: { basePrice: 1800 },
        VideoRecording: { basePrice: 1800 },
        BlurayPackage: { basePrice: 300 },
        TwoDayEvent: { basePrice: 400 },
        WeddingSession: { basePrice: 600 },
    },
    2022: {
        Photography: { basePrice: 1900 },
        VideoRecording: { basePrice: 1900 },
        BlurayPackage: { basePrice: 300 },
        TwoDayEvent: { basePrice: 400 },
        WeddingSession: { basePrice: 600 },
    },
};

export const productSelectionRules: ProductSelectionRules = {
    requiredServices: {
        BlurayPackage : ["VideoRecording"],
        TwoDayEvent: ["Photography", "VideoRecording"],
    },  
}

type ProductSelectionRules = {
    requiredServices: {
        [key in ServiceType]?: ServiceType[];
    };
};

export type DiscountList= {
    [key in ServiceYear]: {
        [key in DiscountType]: { basePrice: number;};
    };
};

export const discountList: DiscountList = {
    2020: {
        PhotographyAndVideoRecording: { basePrice: 2200 },   
        WeddingSessionWithPhotographyOrVideoRecording: { basePrice: 300 },
        WeddingSessionWithPhotography: { basePrice: priceServiceList[2020].WeddingSession.basePrice },
    },
    2021: {
        PhotographyAndVideoRecording: { basePrice: 2300 },
        WeddingSessionWithPhotographyOrVideoRecording: { basePrice: 300 },
        WeddingSessionWithPhotography: { basePrice: priceServiceList[2021].WeddingSession.basePrice },
    },
    2022: {
        PhotographyAndVideoRecording: { basePrice: 2500 },
        WeddingSessionWithPhotographyOrVideoRecording: { basePrice: 300 },
        WeddingSessionWithPhotography: { basePrice: 0 },
    },
};