
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../redux-store/hooks";

const RootRedirect: React.FC = () => {

    const isLoggedIn = useAppSelector(
        (state) => state.auth.isLoggedIn
    );

    const role = useAppSelector(
        (state) => state.auth.userDetails?.roleNames?.[0]
    );

    const navigate = useNavigate();

    useEffect(() => {

        if (!isLoggedIn) {
            navigate("/login", { replace: true });
            return;
        }

        if (role === "Admin") {
            navigate("/user-management", { replace: true });
        }
        else if (role === "User") {
            navigate("/news", { replace: true });
        }
        else {
            navigate("/unauthorized", { replace: true });
        }

    }, [isLoggedIn, role, navigate]);

    return null;
};

export default RootRedirect;
