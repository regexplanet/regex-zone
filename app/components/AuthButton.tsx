import { Link as RemixLink, useRouteLoaderData } from "@remix-run/react";
import { PiUserCircle, PiUserCircleFill } from "react-icons/pi";
import { User } from "~/types/User";

export function AuthButton() {
    const user = useRouteLoaderData<User|null>("root");

    let authImage:JSX.Element = <PiUserCircle title={"Not logged in"} />;
    if (user) {
        if (user.avatar) {
            authImage = <img src={user.avatar} alt={user.displayName} className="rounded-circle" style={{"width": "1.75rem", "height": "1.75rem"}} />
        } else {
            authImage = <PiUserCircleFill title={user.displayName} />;
        }
    }

    console.log('authbutton', JSON.stringify(user));
    return (
        <>
            <RemixLink className="d-none d-sm-inline text-body-emphasis" to="/auth/" style={{ "fontSize": "1.75rem" }}>
                { authImage }
            </RemixLink>
        </>
    )
}

