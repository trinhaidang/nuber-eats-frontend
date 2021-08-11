import { useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { RESTAURANT_QUERY } from "../../gql/gql-query";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";

interface IRestaurantParams {
    id: string;
}

export const Restaurant = () => {
    const params = useParams<IRestaurantParams>();
    const {loading, data} = useQuery<restaurant, restaurantVariables>(
        RESTAURANT_QUERY,
        {
            variables: {
                input: {
                    restaurantId: +params.id,
                }
            }
        }
    );
    console.log(data);

    return (
        <div>
            <Helmet>
                <title>Restaurant | Nuber Eats</title>
            </Helmet>
            Restaurant
        </div>
    );  
}