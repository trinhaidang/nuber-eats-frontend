import { useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { capitalizeAllWords } from "../../common/utility";
import { RESTAURANT_QUERY } from "../../gql/gql-query";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";

interface IRestaurantParams {
    id: string;
}

export const Restaurant = () => {
    const params = useParams<IRestaurantParams>();
    const { loading, data, error } = useQuery<restaurant, restaurantVariables>(
        RESTAURANT_QUERY,
        {
            variables: {
                input: {
                    restaurantId: +params.id,
                }
            }
        }
    );
    if (error) console.log(error);

    return (
        <div>
            <Helmet>
                <title>Restaurant | Nuber Eats</title>
            </Helmet>
            <div 
                className="bg-gray-800 bg-center py-40 mx-5"
                style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg || RESTAURANT_COVERIMG_DEFAUT})` }}
            >
                <div className="bg-white md:w-3/12 w-3/4 py-8 px-4">
                    <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                    <h5 className="text-sm font-light mb-2">{capitalizeAllWords(data?.restaurant.restaurant?.category?.name || "")}</h5>
                    <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
                </div>
            </div>
            {!data?.restaurant.restaurant?.isValid &&
            <h2 className="font-semibold text-2xl mb-3 m-5">Service is currently unavailable for this restaurant.</h2>
            }
        </div>
    );
}