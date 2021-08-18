import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom"
import { Dish } from "../../components/dish";
import { MY_RESTAURANT_QUERY } from "../../gql/gql-query";
import { myRestaurant, myRestaurantVariables } from "../../__generated__/myRestaurant";

interface IParams {
    id: string;
}

export const MyRestaurant = () => {
    const { id } = useParams<IParams>();

    const { data } = useQuery<myRestaurant, myRestaurantVariables>(
        MY_RESTAURANT_QUERY,
        {
            variables: {
                input: { id: +id }
            }
        }
    );
    console.log(data);

    return (
        <div className="mx-5">
            <Helmet>
                <title>My Restaurant | Nuber Eats</title>
            </Helmet>

            <div className="bg-gray-700 py-28 bg-center bg-cover"
                style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}
            ></div>
            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
                    Add Dish &rarr;
                </Link>
                <Link to={``} className="text-white bg-lime-700 py-3 px-10">
                    Add Promotion &rarr;
                </Link>
                <div className="mt-10">
                    {data?.myRestaurant.restaurant?.menu.length === 0 ?
                        <h4 className="text-xl mb-5">Please create a dish!</h4> :
                        
                        <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                            {data?.myRestaurant.restaurant?.menu.map((dish) => (
                                <Dish name={dish.name} price={dish.price} description={dish.description} />
                            ))}
                        </div>

                    }
                </div>
            </div>

            {!data?.myRestaurant.restaurant.isValid &&
                <div>
                    <h2 className="font-semibold text-2xl mb-3">Service is currently unavailable for this restaurant.</h2>
                    <h4 className=" text-xl">Contact admin for more information.</h4>
                </div>
            }
        </div>
    );
}