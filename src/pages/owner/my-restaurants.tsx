import { useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { RestaurantItem } from "../../components/restaurant";
import { SearchForm } from "../../components/search";
import { MY_RESTAURANTS_QUERY } from "../../gql/gql-query";
import { myRestaurantsPageQuery, myRestaurantsPageQueryVariables } from "../../__generated__/myRestaurantsPageQuery";

export const MyRestaurants = () => {

    const [pageNo, setPage] = useState(1);
    const { data, loading, error } = useQuery<myRestaurantsPageQuery, myRestaurantsPageQueryVariables>(
        MY_RESTAURANTS_QUERY,
        {
            variables: {
                input: { page: pageNo }
            }
        }
    );
    if (error) console.log(error);

    //set pageNo + 1 when click nextpage
    const onNextPageClick = () => setPage((current) => current + 1);
    const onPreviousPageClick = () => setPage((current) => current - 1);

    return (
        <div className="mx-5">
            <Helmet>
                <title>My Restaurants | Nuber Eats</title>
            </Helmet>

            {!loading &&
                <div className="container mt-32">
                    <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>

                    {data?.myRestaurants.ok
                        && data.myRestaurants.totalResults === 0
                        && <>
                            <h4 className="text-xl mb-5">You have no restaurants.</h4>
                            <Link className="link" to="/add-restaurant">
                                Create one &rarr;
                            </Link>
                        </>
                    }

                    {data?.myRestaurants.ok
                        && data.myRestaurants.totalResults !== 0
                        && <>
                            <Link className="link" to="/add-restaurant">
                                Add more restaurants &rarr;
                            </Link>

                            {/*  Restaurants list  */}
                            <div className="mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
                                {data?.myRestaurants.results?.map((restaurant) => {
                                    const img = restaurant.coverImg || RESTAURANT_COVERIMG_DEFAUT;
                                    return (
                                        <RestaurantItem key={restaurant.id} id={restaurant.id + ""} name={restaurant.name} categoryName={restaurant.category?.name} coverImg={img} />
                                    );
                                })}
                            </div>

                            {/* Paging */}
                            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
                                {
                                    pageNo > 1 ?
                                        (<button
                                            onClick={onPreviousPageClick}
                                            className="focus:outline-none font-medium text-2xl"
                                        >
                                            &larr;
                                        </button>) : (<div></div>)
                                }
                                <span>Page {pageNo} of {data?.myRestaurants.totalPages}</span>
                                {
                                    pageNo !== data?.myRestaurants.totalPages ?
                                        (<button
                                            onClick={onNextPageClick}
                                            className="focus:outline-none font-medium text-2xl"
                                        >
                                            &rarr;
                                        </button>) : (<div></div>)
                                }
                            </div>

                        </>
                    }

                </div>
            }
        </div>
    );
}