export interface IOtp {
    userID: any;
    type: string;
    otp: string;
    expiration: Date | null;
};
