import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './dto/listing.dto';
export declare class ListingsController {
    private listingsService;
    constructor(listingsService: ListingsService);
    getCategories(): Promise<any>;
    create(dto: CreateListingDto, user: any): Promise<any>;
    findAll(search?: string, categoryId?: string, minPrice?: string, maxPrice?: string, condition?: string, ownerId?: string, status?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateListingDto, user: any): Promise<any>;
    remove(id: string, user: any): Promise<{
        success: boolean;
    }>;
    approve(id: string, user: any): Promise<any>;
    reject(id: string, user: any): Promise<any>;
}
