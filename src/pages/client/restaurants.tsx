import { useQuery } from "@apollo/client";
import { RESTAURANTS_QUERY } from "../../gql/gql-query";
import { restaurantsPageQuery, restaurantsPageQueryVariables } from "../../__generated__/restaurantsPageQuery";

export const Restaurants = () => {

    const { data, loading, error } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(
        RESTAURANTS_QUERY,
        {
            variables: {
                input: { page: 1 }
            }
        }
    );
    const images_folder = "/images/";

    console.log(data);
    return (
        <div>
            {/* Search Banner */}
            <form name="restaurants-search-form" className="bg-gray-800 w-full py-40 flex items-center justify-center" >
                <input
                    type="Search"
                    className="input rounded-md border-0 w-3/12"
                    placeholder="Search restaurants..."
                />                
            </form>

            {!loading &&
                <div className="max-w-screen-2xl mx-auto mt-8">
                    {/* Categories list */}
                    <div className="flex justify-around max-w-sm mx-auto">
                        {data?.allCategories.categories?.map((category) => {
                            const img = images_folder + (category.coverImg ? category.coverImg : "categories/default.png");
                            return (
                                <div className="group flex flex-col items-center cursor-pointer">
                                <div
                                    className="w-16 h-14 bg-cover group-hover:bg-gray-100 rounded-full "
                                    style={{backgroundImage: `url(${img})` ,}}
                                >
                                </div>
                                    <span className="mt-1 text-sm text-center font-medium">{category.name[0].toUpperCase()}{category.name.slice(1)}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Restaurants list */}
                    <div className="mt-10 grid grid-cols-3 gap-x-5 gap-y-10">
                        {data?.restaurants.results?.map((restaurant) => {
                            const img = images_folder + (restaurant.coverImg ? restaurant.coverImg : "restaurants/default.jpg");
                            return (
                                <div>
                                    <div 
                                        className="bg-red-500 bg-cover bg-center mb-3 py-28"
                                        style={{backgroundImage: `url(${img})` ,}}
                                    ></div>
                                    <h3 className="text-xl font-medium">{restaurant.name}</h3>
                                    <span className="border-t-2 border-gray-200">{restaurant.category?.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            }
        </div>
    );
};