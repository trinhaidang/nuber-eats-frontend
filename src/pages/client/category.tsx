import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom"
import { CATEGORY_QUERY } from "../../gql/gql-query";
import { category, categoryVariables } from "../../__generated__/category";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { CATEGORY_COVERIMG_DEFAUT, RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { RestaurantItem } from "../../components/restaurant";
import { capitalizeAllWords } from "../../common/utility";


interface ICategoryParams {
    slug: string;
}

export const Category = () => {

    const [pageNo, setPage] = useState(1);
    const params = useParams<ICategoryParams>();
    const { data, loading, error } = useQuery<category, categoryVariables>(
        CATEGORY_QUERY,
        {
            variables: {
                input: {
                    page: pageNo,
                    slug: params.slug,
                }
            }
        }
    );
    console.log(data);
    if (error) console.log(error);

    const onNextPageClick = () => setPage((current) => current + 1);
    const onPreviousPageClick = () => setPage((current) => current - 1);

    return (
        <div className="mx-5">
            <Helmet>
                <title>Category | Nuber Eats</title>
            </Helmet>

            <div 
                className="bg-gray-800 bg-center py-40"
                style={{ backgroundImage: `url(${data?.category.category?.coverImg || CATEGORY_COVERIMG_DEFAUT})` }}
            >
                <div className="bg-white md:w-3/12 w-3/4 py-8 px-4">
                    <h4 className="text-4xl mb-3">{capitalizeAllWords(data?.category.category?.name || "")}</h4>
                </div>
            </div>

            {/* Restaurants list */}
            <div className="mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.category.restaurants?.map((restaurant) => {
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
                <span>Page {pageNo} of {data?.category.totalPages}</span>
                {
                    pageNo !== data?.category.totalPages ?
                        (<button
                            onClick={onNextPageClick}
                            className="focus:outline-none font-medium text-2xl"
                        >
                            &rarr;
                        </button>) : (<div></div>)
                }
            </div>
        </div>
    );
}