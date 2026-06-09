import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            preferredLanguage: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            preferredLanguage: any;
        };
    }>;
    getProfile(user: any): Promise<{
        id: any;
        name: any;
        email: any;
        phone: any;
        role: any;
        preferredLanguage: any;
        verificationStatus: any;
    }>;
}
