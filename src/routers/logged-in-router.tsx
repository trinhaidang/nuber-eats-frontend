import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";

const ClientRoutes = [
    <Route path="/" exact>
        <Restaurants />
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
                    <Redirect to="/" />
                </Switch>

            </Router>
    );
};
