import { useQuery, useSubscription } from "@apollo/client";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom"
import { GET_ORDER_QUERY, ORDER_SUBSCRIPTION } from "../../gql/gql-query";
import { getOrder, getOrderVariables } from "../../__generated__/getOrder";
import { orderUpdates, orderUpdatesVariables } from "../../__generated__/orderUpdates";


interface IParams {
    id: string;
}

export const Order = () => {
    const params = useParams<IParams>();

    const { data } = useQuery<getOrder, getOrderVariables>(
        GET_ORDER_QUERY,
        {
            variables: { input: { id: +params.id } }
        }
    )
    console.log(data);

    const { data: subscriptionData } = useSubscription<orderUpdates, orderUpdatesVariables>(
        ORDER_SUBSCRIPTION,
        {
            variables: { input: { id: +params.id } }
        }
    )
    console.log(subscriptionData);

    return (
        <div className="mt-32 container flex justify-center px-5">
            <Helmet>
                <title>Order #{params.id} | NUber Eats</title>
            </Helmet>
            <div className="border border-fray-800 w-full max-w-screen-sm flex flex-col justify-center">
                <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
                    Order #{params.id}
                </h4>
                <h5 className="p-5 pt-10 text-3xl text-center">
                    {data?.getOrder.order?.total}.000 (VND)
                </h5>
                {data?.getOrder.order?.items?.length !== 0 &&
                    data?.getOrder.order?.items?.map(item =>
                    (<div className="mx-5 grid grid-cols-12 gap-6 pt-2 px-1 overflow-hidden">
                        <div className="col-span-7">
                            <h6 className="font-semibold"><FontAwesomeIcon icon={faHamburger} className="text-sm mx-2" />{" "}
                                {item.dish.name}</h6>
                            {item.options?.length !== 0 &&
                                item.options?.map(option => (
                                    <h6 className="text-gray-500 text-sm font-medium ml-10">{" + " + option.name}</h6>
                                ))
                            }
                        </div>
                        <div className="col-span-2 font-medium">{item.quantity}</div>
                        <div className="font-medium col-span-3 overflow-scroll no-scrollbar w-48">{item.quantity * item.itemPrice + ".000"}</div>
                    </div>)
                    )
                }
                <div className="p-5 text-xl grid gap-6">
                    <div className="border-t pt-5 border-gray-700">
                        Prepared By: {" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.restaurant?.name}
                        </span>
                    </div>
                    <div className="border-t pt-5 border-gray-700">
                        Delivered To:{" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.customer.email}
                        </span>
                    </div>
                    <div className="border-t border-b py-5 border-gray-700">
                        Driver:{" "}
                        <span className="font-medium">
                            {data?.getOrder.order?.driver?.email || "Not yet."}
                        </span>
                    </div>
                    <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                        Status: {data?.getOrder.order?.status}
                    </span>
                </div>
            </div>
        </div>
    );
};