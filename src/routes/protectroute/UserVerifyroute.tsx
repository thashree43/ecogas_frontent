import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetToken } from "../../token/gettoken";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const UserVerifyRoute: React.FC<ProtectedRouteProps> = ({
    component: Component,
}) => {
    const navigate = useNavigate();
    const [isPublicRoute, setIsPublicRoute] = useState<boolean>(false);

    // Call the custom hook inside a React component
    const token = useGetToken("userToken");

    useEffect(() => {
        console.log("Token in verify route:", token);
        if (token) {
            console.log("Valid token found, redirecting to home");
            navigate("/home");
            return;
        }
        setIsPublicRoute(true);
    }, [navigate, token]);

    return isPublicRoute ? <Component /> : null;
};

export default UserVerifyRoute;
