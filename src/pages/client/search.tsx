import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useLocation } from "react-router-dom"
import { RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { Categories } from "../../components/categories";
import { RestaurantItem } from "../../components/restaurant";
import { SearchForm } from "../../components/search";
import { SEARCH_RESTAURANT } from "../../gql/gql-query";
import { searchRestaurant, searchRestaurantVariables } from "../../__generated__/searchRestaurant";


export const SearchRestaurant = () => {

    // if !searchTerm do nothing, back to home
    // else call query -> not always called -> use lazyQuery
    const [pageNo, setPage] = useState(1);

    const location = useLocation();
    const history = useHistory();
    const [callQuery, { loading, data, called }]  //only called when callQuery (at line 23) if !searchTerm
        = useLazyQuery<searchRestaurant, searchRestaurantVariables>(SEARCH_RESTAURANT);

    const [__dirname, searchTerm] = location.search.split("?term=");
    const performSearch = (page: number, query: string) => {
        if (!query)
            history.replace("/");
        callQuery({
            variables: {
                input: {
                    page,
                    query,
                }
            }
        });
        console.log(data);
    }

    useEffect(() => {
        performSearch(pageNo, searchTerm);
        console.log("Query called with ", searchTerm, pageNo);
    }, [history, location]);

    const onNextPageClick = () => {
        setPage((current) => current + 1);
        performSearch(pageNo + 1, searchTerm);
        console.log("Query called with ", searchTerm, pageNo + 1);
    }
    const onPreviousPageClick = () => {
        setPage((current) => current - 1);
        performSearch(pageNo - 1, searchTerm);
        console.log("Query called with ", searchTerm, pageNo - 1);
    }


    return (
        <div>
            <Helmet>
                <title>Search | Nuber Eats</title>
            </Helmet>

            <SearchForm searchTerm={searchTerm} />

            {!loading &&
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">

                    {/* Restaurants list */}
                    <div className="mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.searchRestaurant.restaurants?.map((restaurant) => {
                            const img = restaurant.coverImg || RESTAURANT_COVERIMG_DEFAUT;
                            return (
                                <RestaurantItem key={restaurant.id} id={restaurant.id + ""} name={restaurant.name} categoryName={restaurant.category?.name} coverImg={img} />
                            );
                        })}
                    </div>

                    {/* Paging */}
                    {data?.searchRestaurant.totalPages ? data?.searchRestaurant.totalPages > 1 &&
                        (
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
                                <span>Page {pageNo} of {data?.searchRestaurant.totalPages}</span>
                                {
                                    pageNo !== data?.searchRestaurant.totalPages ?
                                        (<button
                                            onClick={onNextPageClick}
                                            className="focus:outline-none font-medium text-2xl"
                                        >
                                            &rarr;
                                        </button>) : (<div></div>)
                                }
                            </div>
                        )
                        :
                        (
                            <div className="h-screen flex flex-col items-center justify-center">
                                <h4 className="font-medium text-base mb-5">
                                    No result found with "{searchTerm}".
                                </h4>
                                <Link className="hover:underline text-lime-600" to="/">Go back Home &rarr;</Link>
                            </div>
                        )
                    }
                </div>
            }

        </div>
    );
};