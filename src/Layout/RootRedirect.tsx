
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../redux-store/hooks";

const RootRedirect = () => {
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
      //const isLoggedIn = true;
    const role = useAppSelector((state) => state.auth.userDetails?.role);
    const navigate = useNavigate();
    //const redirectPath = localStorage.getItem("redirectAfterLogin");
    useEffect(() => {
        if (isLoggedIn) {
            // if (role === "User") {
            //     navigate(redirectPath || "/spatial-query", { replace: true });
            // } else if (role === "Admin") {

            //     navigate(redirectPath || "/spatial-query", { replace: true });
            // }

            // localStorage.removeItem("redirectAfterLogin");
            navigate("/user-management", { replace: true });
        } else {
            navigate("/login");
        }
    }, [isLoggedIn, role, navigate]);


    return null; 
};

export default RootRedirect;