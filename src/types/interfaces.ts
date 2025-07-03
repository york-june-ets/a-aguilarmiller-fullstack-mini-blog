import { Dispatch, SetStateAction } from "react";

export interface User {
    id: string;
    email: string;
    password: string;
}

export interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}