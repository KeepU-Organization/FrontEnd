import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "../hooks/UseAuth.tsx";
import React from "react";
import {LoadingComponent} from "./loadingComponent/LoadingComponent.tsx";

interface PrivateRouteProps{
    children:React.ReactNode;
}

export const PrivateRouteParent: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user,  isAuthenticated,isLoading } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return <LoadingComponent/>; // O un componente de carga
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && !user.emailVerified) {
        return <Navigate to="/authCode" state={{ from: location }} replace />;
    }
    if (user?.userType !== "PARENT") {
        return <Navigate to="/homeChild" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
export const PrivateRouteChildren: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user,  isAuthenticated,isLoading } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return <LoadingComponent/>; // O un componente de carga
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && !user.emailVerified) {
        return <Navigate to="/authCode" state={{ from: location }} replace />;
    }
    if (user?.userType !== "CHILD") {
        return <Navigate to="/homeParent" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { user,isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return  <LoadingComponent/>;
    }

    // Si el usuario está autenticado, redirigir al home
    if (isAuthenticated ) {
        if (user?.userType=="PARENT") {
            return <Navigate to="/homeParent"  />;}

        else if (user?.userType=="CHILD") {
            return <Navigate to="/homeChild" />;
        }
    }

    // Si no está autenticado, mostrar el componente
    return <>{children}</>;
}
interface AuthRouteProps {
    children: React.ReactNode;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
    const {user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return  <LoadingComponent/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login"  />;
    }
    if (user?.emailVerified){
        if (user?.userType=="PARENT") {
            return <Navigate to="/homeParent"  />;}

        else if (user?.userType=="CHILD") {
            return <Navigate to="/homeChild" />;
        }
    }

    // Si no está autenticado, mostrar el componente
    return <>{children}</>;
}