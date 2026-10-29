
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../redux-store/hooks";

const RootRedirect = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
      //const isLoggedIn = true;
    const role = useAppSelector((state) => state.auth.userDetails?.user?.roleNames[0]);
    const navigate = useNavigate();
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    useEffect(() => {
        if (isLoggedIn) {
            if (role === "User") {
                navigate(redirectPath || "/news", { replace: true });
            } else if (role === "Admin") {

                navigate(redirectPath || "/user-management", { replace: true });
            }

            localStorage.removeItem("redirectAfterLogin");
    
        } else {
            navigate("/login");
        }
    }, [isLoggedIn, role, navigate]);


    return null; 
};

export default RootRedirect;