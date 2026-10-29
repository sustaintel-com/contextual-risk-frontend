import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import { useAppSelector } from "../redux-store/hooks";
import RootRedirect from "./RootRedirect";
import { lazy, Suspense } from "react";
import DashLoader from "../components/dash-loader/DashLoader";
import Unauthorized from "./Unauthorized";
import NotFound from "./NotFoundPage";
import UserManagementLanding from "../Pages/user-management/UserManagementLanding";
import AdminUserManagementList from "../Pages/user-management/admin-user-list/AdminUserManagementList";
import AddUser from "../Pages/user-management/add-user/AddUser";
import NewsManagementLanding from "../Pages/News/NewsManagementLanding";
import NewsManagementList from "../Pages/News/news-list/NewsManagementList";
import AddNewsManagement from "../Pages/News/add-news/AddNewsManagement";
const LoginPage = lazy(() => import("../Pages/Login/Login"));
const ResetPasswordPage = lazy(() => import("../Pages/Login/ResetPassword"));
const Layout = lazy(() => import("../Layout/Layout"));

const AppRouter: React.FC = () => {
   const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    //const isLoggedIn = true;
    const role: any = useAppSelector((state) => state.auth.userDetails?.user?.roleNames[0]);
    console.log(role)
    const requireAuth = (allowedRoles: string[]) => {
        if (!isLoggedIn) {
            return redirect("/login");
        }
        if (isLoggedIn && allowedRoles && !allowedRoles.includes(role)) {

            return redirect('/unauthorized'); 
        }
        return null;
    };

    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootRedirect />, 
        },
                {
            path: "/",
            loader: () => requireAuth(["Admin", "User"]),
            element: <Layout />,
            children: [
               
                {
                    path: "user-management",
                   loader: () => requireAuth(["Admin"]),
                    element: (
                        <Suspense fallback={<DashLoader isRunLoader={true} text="Page is Loading..Please Wait.." />}>
                            <UserManagementLanding />
                        </Suspense>
                    ),
                    children: [
                        { index: true, element: <AdminUserManagementList /> },
                        {
                            path: "add-user",
                           loader: () => requireAuth(["Admin"]),
                            element: <AddUser />,
                        }
                    ]
                },
                {
                    path: "news",
                   loader: () => requireAuth(["Admin", "User"]),
                    element: (
                        <Suspense fallback={<DashLoader isRunLoader={true} text="Page is Loading..Please Wait.." />}>
                            <NewsManagementLanding />
                        </Suspense>
                    ),
                    children: [
                        { index: true, element: <NewsManagementList /> },
                        {
                            path: "add-news",
                           loader: () => requireAuth(["Admin", "User"]),
                            element: <AddNewsManagement />,
                        }
                    ]
                },
                
                    ],
                
        },
        {
            path: "/login",
            loader: () => {
                if (isLoggedIn) {
                    return redirect("/");
                }
                return null;
            },
            element: <LoginPage />,
        },
        {
            path: "/unauthorized",
            element: <Unauthorized />,
        },
        {
            path: "/reset-password",
            element: (
                <Suspense fallback={<DashLoader isRunLoader={true} text="Page is Loading..Please Wait.." />}>
                    <ResetPasswordPage />
                </Suspense>
            ),
        },
        {
            path: "*",
            element: <NotFound />,
        }
    ]);

    return <RouterProvider router={router} />;
};

export default AppRouter;
