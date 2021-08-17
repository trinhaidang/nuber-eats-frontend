import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { CATEGORY_COVERIMG_DEFAUT, RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { capitalizeAllWords, capitalizeFirstLetter } from "../../common/utility";
import { Categories } from "../../components/categories";
import { RestaurantItem } from "../../components/restaurant";
import { SearchForm } from "../../components/search";
import { CATEGORIES_QUERY, RESTAURANTS_QUERY } from "../../gql/gql-query";
import { categoriesQuery } from "../../__generated__/categoriesQuery";
import { restaurantsPageQuery, restaurantsPageQueryVariables } from "../../__generated__/restaurantsPageQuery";

export const Restaurants = () => {

    /*--- display func  ---*/
    //set default value of pageNo is 1
    const [pageNo, setPage] = useState(1);
    const { data: resData, loading: resLoading, error: resError } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(
        RESTAURANTS_QUERY,
        {
            variables: {
                input: { page: pageNo }
            }
        }
    );
    if (resError) console.log(resError);

    const { data: catData, loading: catLoading, error: catError } = useQuery<categoriesQuery>(
        CATEGORIES_QUERY
    );
    if (catError) console.log(catError);

    //set pageNo + 1 when click nextpage
    const onNextPageClick = () => setPage((current) => current + 1);
    const onPreviousPageClick = () => setPage((current) => current - 1);

    return (
        <div className="mx-5">
            <Helmet>
                <title>Home | Nuber Eats</title>
            </Helmet>

            <SearchForm searchTerm="" />

            <div className="container mt-8">
                {!catLoading &&
                    //  Categories list 
                    <Categories categories={catData?.allCategories.categories} currentCategoryId={null} />
                }

                {!resLoading &&
                    <>
                        {/* Restaurants list */}
                        <div className="mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
                            {resData?.restaurants.results?.filter((restaurant) => restaurant.isValid).map((restaurant) => {
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
                            <span>Page {pageNo} of {resData?.restaurants.totalPages}</span>
                            {
                                pageNo !== resData?.restaurants.totalPages ?
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
            );
        </div>
    );
};