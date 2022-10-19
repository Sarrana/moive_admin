import { useEffect } from "react";
import { useNavigate, Outlet, To, NavigateOptions } from "react-router-dom";

export default function NavigatePage(props: { to: To, options?: NavigateOptions }) {
    let navigate = useNavigate();
    useEffect(() => {
        navigate(props.to, props.options);
    }, []);
    return (
        <Outlet />
    );
}
