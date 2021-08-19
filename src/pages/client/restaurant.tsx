import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams } from "react-router-dom";
import { RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { capitalizeAllWords } from "../../common/utility";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { CREATE_ORDER_MUTATION, RESTAURANT_QUERY } from "../../gql/gql-query";
import { createOrder, createOrderVariables } from "../../__generated__/createOrder";
import { CreateOrderInput, CreateOrderItemInput } from "../../__generated__/globalTypes";
import { restaurant, restaurantVariables } from "../../__generated__/restaurant";

interface IRestaurantParams {
    id: string;
}

export const Restaurant = () => {
    const history = useHistory();

    // form
    const params = useParams<IRestaurantParams>();
    const { loading, data, error } = useQuery<restaurant, restaurantVariables>(
        RESTAURANT_QUERY,
        {
            variables: {
                input: {
                    restaurantId: +params.id,
                }
            }
        }
    );
    if (error) console.log(error);

    // mutation
    const onCompleted = (data: createOrder) => {
        const { createOrder: { ok, error, orderId }} = data;
        if(ok) {
            history.push(`/orders/${orderId}`);
        } else {
            alert(error); 
        }   
    }
    const [createOrderMutaion, {loading: placingOrder}] = useMutation<createOrder, createOrderVariables>(
        CREATE_ORDER_MUTATION,
        {onCompleted},
    );

    // order 
    const [orderStarted, setOrderStarted] = useState(false);
    const triggerStartOrder = () => {
        setOrderStarted(true);
    }
    const triggerCancelOrder = () => {
        const cancel = window.confirm("Want to cancel this order?");
        if (cancel) {
            setOrderStarted(false);
            setOrderItems([]);
        }
    }
    const triggerConfirmOrder = () => {
        if(orderItems.length === 0) {
            alert("You have not chosen an item");
            return;
        }
        const ok = window.confirm(`You are about to place an order: total items ${orderItems.length} `);
        if(ok) {
            // call mutation
            createOrderMutaion({
                variables: {
                    input: {
                        restaurantId: +params.id,
                        items: orderItems
                    }
                },
            });
        }
    }

    // order item
    const getItemFromOrder = (dishId: number) => {
        return orderItems.find((order) => order.dishId === dishId);
    }
    const isSelected = (dishId: number) => {
        return Boolean(getItemFromOrder(dishId));
    }
    const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

    // crud item
    const removeFromOrder = (dishId: number) => {
        setOrderItems((current) => current.filter(
            (dish) => dish.dishId !== dishId)
        );
    };
    const addItemToOrder = (dishId: number) => {
        if (isSelected(dishId)) {
            return;
        }
        setOrderItems(current => [{ dishId, options: [] }, ...current]);
    };

    // item options
    const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
        return item.options?.find(
            (option) => option.name === optionName
        );
    };
    const isOptionSelected = (dishId: number, optionName: string) => {
        const item = getItemFromOrder(dishId);
        if (item) {
            const option = getOptionFromItem(item, optionName);
            if (option) return true;
        }
        return false;
    }
    const addOptionToItem = (dishId: number, optionName: string) => {
        if (!isSelected(dishId)) {
            return;
        }
        const oldItem = getItemFromOrder(dishId);
        if (oldItem) {
            removeFromOrder(dishId);
            const hasOption = Boolean(getOptionFromItem(oldItem, optionName))
            if (!hasOption) {
                setOrderItems(current => [
                    { dishId, options: [{ name: optionName }, ...oldItem.options!] },
                    ...current
                ]);
            }
            else {
                setOrderItems(current => [
                    { dishId, options: oldItem.options?.filter((existOption) => existOption.name !== optionName) },
                    ...current
                ]);
            }
        }
    }
    // const removeOptionFromItem = (dishId: number, optionName: string) => {
    //     if (!isSelected(dishId)) {
    //         return;
    //     }
    //     const oldItem = getItemFromOrder(dishId);
    //     if (oldItem) {
    //         removeFromOrder(dishId);
    //         setOrderItems(current => [
    //             {
    //                 dishId,
    //                 options: oldItem.options?.filter(option => option.name !== optionName)
    //             },
    //             ...current,
    //         ]);
    //         return;
    //     }
    // };



    console.log(orderItems);

    return (
        <div>
            <Helmet>
                <title>Restaurant | Nuber Eats</title>
            </Helmet>
            <div
                className="bg-gray-800 bg-center py-40 mx-5"
                style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg || RESTAURANT_COVERIMG_DEFAUT})` }}
            >
                <div className="bg-white md:w-3/12 w-3/4 py-8 px-4">
                    <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
                    <h5 className="text-sm font-light mb-2">{capitalizeAllWords(data?.restaurant.restaurant?.category?.name || "")}</h5>
                    <h6 className="text-sm font-light">{data?.restaurant.restaurant?.address}</h6>
                </div>
            </div>
            {!data?.restaurant.restaurant?.isValid ?
                <h2 className="font-semibold text-2xl mb-3 m-5">Service is currently unavailable for this restaurant.</h2>
                :
                <div className="my-10 mx-5">
                    {data?.restaurant.restaurant?.menu.length === 0 ?
                        <h4 className="text-xl mb-5">Please create a dish!</h4> :
                        <div className="container flex flex-col items-end mt-20">
                            {!orderStarted &&
                                <button onClick={triggerStartOrder} className="btn px-10" >
                                    Start Order
                                </button>
                            }
                            {orderStarted &&
                                <div className="flex items-center">
                                    <button onClick={triggerConfirmOrder} className="btn px-10 mr-3" >
                                        Confirm Order
                                    </button>
                                    <button onClick={triggerCancelOrder} className="btn px-10 bg-black hover:bg-black" >
                                        Cancel Order
                                    </button>
                                </div>
                            }

                            <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                                {data?.restaurant.restaurant?.menu.map((dish) => (
                                    <Dish
                                        isSelected={isSelected(dish.id)}
                                        id={dish.id}
                                        orderStarted={orderStarted}
                                        name={dish.name}
                                        price={dish.price}
                                        description={dish.description}
                                        isCustomer={true}
                                        options={dish.options}
                                        addItemToOrder={addItemToOrder}
                                        removeFromOrder={removeFromOrder}
                                    >
                                        {dish.options?.map((option, index) => (
                                            <DishOption
                                                key={index}
                                                dishId={dish.id}
                                                isSelected={isOptionSelected(dish.id, option.name)}
                                                name={option.name}
                                                extra={option.extra}
                                                addOptionToItem={addOptionToItem}
                                            // removeOptionFromItem={removeOptionFromItem}
                                            />
                                        ))}
                                    </Dish>
                                ))}
                            </div>
                        </div>

                    }
                </div>
            }

        </div>
    );
}