export declare enum ListingCondition {
    NEW = "New",
    GOOD = "Good",
    ACCEPTABLE = "Acceptable"
}
export declare class CreateListingDto {
    title: string;
    description: string;
    categoryId: number;
    condition: ListingCondition;
    dailyPrice: number;
    depositAmount: number;
    photoUrls?: string[];
}
export declare class UpdateListingDto {
    title?: string;
    description?: string;
    categoryId?: number;
    condition?: ListingCondition;
    dailyPrice?: number;
    depositAmount?: number;
    photoUrls?: string[];
}
