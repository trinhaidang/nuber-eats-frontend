import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { CATEGORY_COVERIMG_DEFAUT, RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { capitalizeAllWords, capitalizeFirstLetter } from "../../common/utility";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANTS_QUERY } from "../../gql/gql-query";
import { restaurantsPageQuery, restaurantsPageQueryVariables } from "../../__generated__/restaurantsPageQuery";

export const Restaurants = () => {

    /*--- display func  ---*/
    //set default value of pageNo is 1
    const [pageNo, setPage] = useState(1);
    const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(
        RESTAURANTS_QUERY,
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

    /*--- search func  ---*/
    interface IFormProps {
        searchTerm: string;
    }
    const history = useHistory();

    const { register, getValues, handleSubmit } = useForm<IFormProps>();
    const onSearchSubmit = () => {
        const { searchTerm } = getValues();
        history.push({
            pathname: "/search",
            search: `?term=${searchTerm}`,
        });
    };

    return (
        <div className="mx-5">
            <Helmet>
                <title>Home | Nuber Eats</title>
            </Helmet>
            {/* Banner & search form */}
            <form
                onSubmit={handleSubmit(onSearchSubmit)}
                name="restaurants-search-form"
                className="bg-gray-800 w-full py-40 flex items-center justify-center"
            >
                <input
                    {...register("searchTerm", { required: true, min: 3 })}
                    name="searchTerm"
                    type="Search"
                    className="input rounded-md border-0 w-3/4 md:w-3/12"
                    placeholder="Search restaurants..."
                />
            </form>

            {!loading &&
                <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
                    {/* Categories list */}
                    <div className="flex justify-around max-w-sm mx-auto">
                        {data?.allCategories.categories?.map((category) => {
                            const img = category.coverImg || CATEGORY_COVERIMG_DEFAUT;
                            return (
                                <Link key={category.id} to={`/category/${category.slug}`}>
                                    <div className="group flex flex-col items-center cursor-pointer">
                                        <div
                                            className="w-16 h-14 bg-cover group-hover:bg-gray-200 rounded-full "
                                            style={{ backgroundImage: `url(${img})`, }}
                                        >
                                        </div>
                                        <span className="mt-1 text-sm text-center font-medium">{capitalizeAllWords(category.name)}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Restaurants list */}
                    <div className="mt-16 grid md:grid-cols-3 gap-x-5 gap-y-10">
                        {data?.restaurants.results?.map((restaurant) => {
                            const img = restaurant.coverImg || RESTAURANT_COVERIMG_DEFAUT;
                            return (
                                <Restaurant key={restaurant.id} id={restaurant.id + ""} name={restaurant.name} categoryName={restaurant.category?.name} coverImg={img} />
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
                        <span>Page {pageNo} of {data?.restaurants.totalPages}</span>
                        {
                            pageNo !== data?.restaurants.totalPages ?
                                (<button
                                    onClick={onNextPageClick}
                                    className="focus:outline-none font-medium text-2xl"
                                >
                                    &rarr;
                                </button>) : (<div></div>)
                        }
                    </div>
                </div>
            }
        </div>
    );
};