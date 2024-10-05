import { User } from "./User";

export type RootLoaderData = {
    user: User|null;
    theme: "light" | "dark";
};