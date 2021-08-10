import React from "react";
import { isLoggedInVar } from "../apollo";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { meQuery } from "../__generated__/meQuery";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";

const ClientRoutes = [
    <Route path="/" exact>
        <Restaurants />
    </Route>
];

const ME_QUERY = gql`
    query meQuery {
        me {
            id
            email
            role 
            verified
        }
    }
`;

export const LoggedInRouter = () => {
    const { data, loading, error } = useQuery<meQuery>(ME_QUERY);

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
