export interface AuthCodeResponse {
    id: number;
    userAuth: {
        createdAt: string;
        emailVerified: boolean;
        has2FA: boolean;
        password: string;
        securityKey: string;
        user: {
            id: number;
            name: string;
            lastNames: string;
            email: string;
            userType: string;
            isDarkMode: boolean;
            }
    }
    code: string;
    codeType: string;
    isUsed: boolean;
    expiresAt: string;
}
export interface AuthCodeRequest{
    userId: number;
    authCodeType: string;
}