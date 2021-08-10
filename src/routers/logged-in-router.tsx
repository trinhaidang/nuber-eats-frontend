import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { CreateAccount } from "../pages/create-account";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";

const ClientRoutes = [
    <Route path="/" exact>
        <Restaurants />
    </Route>,
    <Route path="/confirm" exact>
        <ConfirmEmail />
    </Route>
];


export const LoggedInRouter = () => {
    const { data, loading, error } = useMe();

    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        );
    }

    return (
        <Router>
            <Header />
            <Switch>
                {data.me.role === UserRole.Client && ClientRoutes}
                <Route>
                    <NotFound />
                </Route>
            </Switch>

        </Router>
    );
};
