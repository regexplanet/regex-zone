import { createContext } from "react";
import { User } from "~/types/User";


export const AnonymousUser:User = {
    email: "",
    avatar: "",
    displayName: "Anonymous",
    provider: "anonymous",
    providerName: "anonymous",
    id: "anonymous:anonymous",
    isAnonymous: true,

}

const AuthContext = createContext<User>(AnonymousUser);

export { AuthContext }