interface UserType {
    email: string;
    accessToken: string;
}

type UserResponseType = {
    email: string;
    accessToken: string;
};

export type { UserType, UserResponseType };