import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../../components/button";
import { authTokenVar, isLoggedInVar, user } from "../../apollo";
import { useApolloClient } from "@apollo/client";


export const Logout = () => {
    const history = useHistory();
    const user = useApolloClient();
    return (
    <div className="h-screen flex flex-col items-center justify-center">
        <Helmet>
            <title>Logout | Nuber Eats</title>
        </Helmet>
        <button className=" px-5 text-lg font-medium focus:outline-none text-white py-4 transition-colors bg-lime-600 hover:bg-green-700"
            onClick={() => {
                isLoggedInVar(false);
                authTokenVar(null);
                localStorage.clear();
                user.clearStore();
                history.push("/");
            }}>
            Log Out
        </button>
        <Link className="hover:underline text-lime-600" to="/">Go back Home &rarr;</Link>
    </div>
    );
};