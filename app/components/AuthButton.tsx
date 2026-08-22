import { Link, useRouteLoaderData } from "react-router";
import { PiUserCircle, PiUserCircleFill } from "react-icons/pi";
import { RootLoaderData } from "~/types/RootLoaderData";

export function AuthButton() {
    const rootData = useRouteLoaderData<RootLoaderData>("root") as unknown as RootLoaderData;

    const user = rootData?.user;

    let authImage = <PiUserCircle title={"Not logged in"} />;
    if (user) {
        if (user.avatar) {
            authImage = <img src={user.avatar} alt={user.displayName} className="rounded-circle" style={{"width": "1.75rem", "height": "1.75rem"}} />
        } else {
            authImage = <PiUserCircleFill title={user.displayName} />;
        }
    }

    return (
        <>
            <Link className="d-none d-sm-inline text-body-emphasis" to="/auth/" style={{ "fontSize": "1.75rem" }}>
                { authImage }
            </Link>
        </>
    )
}

