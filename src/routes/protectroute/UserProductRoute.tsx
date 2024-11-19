import { useNavigate } from "react-router-dom";
import { useGetToken } from "../../token/gettoken";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const UserProductRoute: React.FC<ProtectedRouteProps> = ({
    component: Component,
}) => {
    const navigate = useNavigate();
    const token = useGetToken("userToken"); // Call the custom hook directly in the component body
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        console.log("Token in protected route:", token);
        
        if (!token) {
            console.log("No valid token found, redirecting to login");
            navigate("/");
            return;
        }

        setIsAuthenticated(true);
    }, [navigate, token]);

    return isAuthenticated ? <Component /> : null;
};

export default UserProductRoute;
