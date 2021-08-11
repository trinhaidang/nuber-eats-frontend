import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom"
import { SEARCH_RESTAURANT } from "../../gql/gql-query";
import { searchRestaurant, searchRestaurantVariables } from "../../__generated__/searchRestaurant";


export const SearchRestaurant = () => {

    // if !searchTerm do nothing, back to home
    // else call query -> not always called -> use lazyQuery
    const location = useLocation();
    const history = useHistory();
    const [callQuery, {loading, data, called}]  //only called when callQuery (at line 23) if !searchTerm
        = useLazyQuery<searchRestaurant, searchRestaurantVariables>(SEARCH_RESTAURANT);
    
    useEffect(() => {
        const [__dirname, searchTerm] = location.search.split("?term=");
        if(!searchTerm) {
            return history.replace("/");
        }
        callQuery({
            variables: {
                input: {
                    page:1,
                    query: searchTerm
                }
            }
        });
    }, [history, location]);

    console.log(loading, data, called)
    
    return (
        <div>
            <Helmet>
                <title>Search | Nuber Eats</title>
            </Helmet>
            Search Restaurants here
        </div>
    );
};