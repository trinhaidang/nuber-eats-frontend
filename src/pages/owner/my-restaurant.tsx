import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom"
import { Dish } from "../../components/dish";
import { MY_RESTAURANT_QUERY } from "../../gql/gql-query";
import { myRestaurant, myRestaurantVariables } from "../../__generated__/myRestaurant";
import {
    VictoryAxis,
    VictoryChart,
    VictoryLabel,
    VictoryLine,
    VictoryPie,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainer,
} from "victory";



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

    const chartData = [
        { x: 1, y: 300 },
        { x: 2, y: 150 },
        { x: 3, y: 425 },
        { x: 4, y: 230 },
        { x: 5, y: 715 },
        { x: 6, y: 680 },
        { x: 7, y: 310 },
    ]

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

                {/* Victory Chart */}
                {/* <div className="mt-20 mb-10">
                    <h4 className="text-center text-2xl font-medium">Sales</h4>
                    <div className="  mt-10">
                        <VictoryChart
                            height={500}
                            theme={VictoryTheme.material}
                            width={window.innerWidth}
                            domainPadding={50}
                            containerComponent={<VictoryVoronoiContainer />}
                        >
                            <VictoryLine
                                labels={({ datum }) => `${datum.y} K`}
                                labelComponent={
                                    <VictoryTooltip
                                        style={{ fontSize: 18 } as any}
                                        renderInPortal
                                        dy={-20}
                                    />
                                }
                                data={data?.myRestaurant.restaurant?.orders.slice(Math.max(data?.myRestaurant.restaurant?.orders.length - 10, 0)).map((order) => ({
                                    x: order.createdAt,
                                    y: order.total,
                                }))}
                                interpolation="natural"
                                style={{
                                    data: {
                                        strokeWidth: 5,
                                    },
                                }}
                            />
                            <VictoryAxis
                                tickLabelComponent={<VictoryLabel renderInPortal />}
                                // domainPadding={{x:10,y:20}}
                                style={{
                                    tickLabels: {
                                        fontSize: 20,
                                        angle: 90,
                                        
                                    } as any,
                                }}
                                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
                            />
                        </VictoryChart>
                    </div>
                </div> */}
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