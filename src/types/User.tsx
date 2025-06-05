export interface CreateParentRequest{
    name: string;
    lastNames: string;
    email: string;
    password: string;
}
export interface userResponse {
    id:number;
    name:string,
    lastNames:string;
    userType:string,
    email:string;

    has2FA:boolean;
    isEmailVerified:boolean;
    isDarkMode:boolean;

    phoneNumber:number;
    age:number;
    getProfilePicture:string;
}
export interface loginResponse {
    userId: number;
    name: string;
    email: string;
    isEmailVerified: boolean;
    userType: string;
    token: string;
    success: boolean;
    message: string;
}
export interface AddChildRequest {
    userId: number;
    childName: string;
    childLastName: string;
    childAge: number;
}
export interface AddChildResponse {
    id: number;
    code:string;
    isUsed:boolean;
    expiresAt: string;
    userId: number;
    childName: string;
    childLastName: string;
    childAge: number;
}
export interface RegisterChildRequest {
    email: string;
    password: string;
    invitationCode: string;
}
export interface ChildSummary{
    id:number;
     name:string;
     lastName:string;
     emai:string;
    age:number;
}
