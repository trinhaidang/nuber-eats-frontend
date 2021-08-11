import { useQuery } from "@apollo/client";
import { RESTAURANTS_QUERY } from "../../gql/gql-query";
import { restaurantsPageQuery, restaurantsPageQueryVariables } from "../../__generated__/restaurantsPageQuery";

export const Restaurants = () => {

    const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(
        RESTAURANTS_QUERY,
        {
            variables: {
                input: { page: 1}
            }
        }
    );

    console.log(data);
    return (<h1>Restaurants</h1>);
};