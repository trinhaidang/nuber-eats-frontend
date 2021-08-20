import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { Restaurant } from "../pages/client/restaurant";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { SearchRestaurant } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { Logout } from "../pages/user/logout";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { AddRestaurant } from "../pages/owner/add-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { AddDish } from "../pages/owner/add-dish";
import { Order } from "../pages/user/order";

const UserRoutes = [
        <Route key="/confirm" path="/confirm" >
        <ConfirmEmail />
    </Route>,
    <Route key="/edit-profile" path="/edit-profile" >
        <EditProfile />
    </Route>,
    <Route key="/orders/:id" path="/orders/:id" exact>
        <Order />
    </Route>,
    <Route key="/logout" path="/logout" >
        <Logout />
    </Route>,
];

const ClientRoutes = [
    <Route key="/" path="/" exact>
        <Restaurants />
    </Route>,
    <Route key="/search" path="/search" exact>
        <SearchRestaurant />
    </Route>,
    <Route key="/category/:slug" path="/category/:slug" exact>
        <Category />
    </Route>,
    <Route key="/restaurant/:id" path="/restaurant/:id" exact>
        <Restaurant />
    </Route>,
];

const OwnerRoutes = [
    <Route key="/" path="/" exact>
        <MyRestaurants />
    </Route>,
    <Route key="/add-restaurant" path="/add-restaurant" exact>
        <AddRestaurant />
    </Route>,
    <Route key="/restaurant/:id" path="/restaurant/:id" exact>
        <MyRestaurant />
    </Route>,
    <Route key="/restaurant/:restaurantId/add-dish" path="/restaurant/:restaurantId/add-dish" exact>
        <AddDish />
    </Route>,
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
                {data.me.role === UserRole.Owner && OwnerRoutes}
                {UserRoutes}
                <Route>
                    <NotFound />
                </Route>
            </Switch>

        </Router>
    );
};
