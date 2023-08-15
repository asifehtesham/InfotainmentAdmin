
export interface SearchModel {
    SearchText?: string;
    SortBy?: number;
    Level?: number;
    Rating?: number;
    Languages?: string[];
    Tag?: string[];
    isFree?: boolean;
    PriceMin?: number;
    PriceMax?: number;
}