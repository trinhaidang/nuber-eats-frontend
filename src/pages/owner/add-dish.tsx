import { useMutation, useQuery } from "@apollo/client";
import { required } from "joi";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm, useFormState } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { RESTAURANT_COVERIMG_DEFAUT } from "../../common/constants";
import { capitalizeAllWords } from "../../common/utility";
import { Button } from "../../components/button";
import { CREATE_DISH_MUTATION, MY_RESTAURANT_QUERY } from "../../gql/gql-query";
import { createDish, createDishVariables } from "../../__generated__/createDish";
import { myRestaurant, myRestaurantVariables } from "../../__generated__/myRestaurant";


interface IParams {
    restaurantId: string
}

interface IFormProps {
    name: string;
    price: string;
    description: string;
    [key: string]: string;
}

export const AddDish = () => {

    const { restaurantId } = useParams<IParams>();

    // get Restaurant 
    const { data } = useQuery<myRestaurant, myRestaurantVariables>(
        MY_RESTAURANT_QUERY,
        {
            variables: {
                input: { id: +restaurantId }
            }
        }
    );

    //  mutation Dish
    const [createDishMutation, { loading }] = useMutation<createDish, createDishVariables>(
        CREATE_DISH_MUTATION,
        {
            refetchQueries: [{
                query: MY_RESTAURANT_QUERY,
                variables: { input: { id: +restaurantId } }
            }]
        }
    );

    // form Dish
    const { register, handleSubmit, formState, getValues, setValue }
        = useForm<IFormProps>({ mode: "onChange" });
    const history = useHistory();
    const onSubmit = () => {
        const { name, price, description, ...rest } = getValues();
        const optionObjects = optionsNumber.map(theId => ({
            name: rest[`${theId}-optionName`],
            extra: +rest[`${theId}-optionExtra`],
        }));
        console.log(optionObjects);
        createDishMutation({
            variables: {
                input: {
                    name,
                    price: +price,
                    description,
                    restaurantId: +restaurantId,
                    options: optionObjects,
                }
            }
        });
        history.goBack();
    };

    // Dish Option
    const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
    const onAddOptionClick = () => {
        console.log(optionsNumber);
        setOptionsNumber((current) => [Date.now(), ...current]);
        console.log(optionsNumber);
    }
    const onDeleteClick = (idToDelete: number) => {
        setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
        setValue(`${idToDelete}-optionName`, "");
        setValue(`${idToDelete}-optionExtra`, "");
    }

    return (
        <>
            <Helmet>
                <title>Add Dish | Nuber Eats</title>
            </Helmet>
            <div
                className="bg-gray-800 bg-center py-40 mx-5"
                style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg || RESTAURANT_COVERIMG_DEFAUT})` }}
            >
                <div className="bg-white md:w-3/12 w-3/4 py-8 px-4">
                    <h4 className="text-4xl mb-3">{data?.myRestaurant.restaurant?.name}</h4>
                    <h5 className="text-sm font-light mb-2">{capitalizeAllWords(data?.myRestaurant.restaurant?.category?.name || "")}</h5>
                    <h6 className="text-sm font-light">{data?.myRestaurant.restaurant?.address}</h6>
                </div>
            </div>
            {!data?.myRestaurant.restaurant?.isValid &&
                <h2 className="font-semibold text-2xl mb-3 m-5">Service is currently unavailable for this restaurant.</h2>
            }
            <div className=" h-screen flex items-center flex-col mt-10 lg:mt-28 mx-5">

                <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
                <form onSubmit={handleSubmit(onSubmit)}
                    className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
                >
                    <input
                        {...register("name", { required: "Name is required." })}
                        className="input" type="text" name="name" placeholder="Name"
                    />
                    <input
                        {...register("price", { required: "Price is required." })}
                        className="input" type="number" name="price" min={0} placeholder="Price (k VND)"
                    />
                    <input
                        {...register("description", { required: "Description is required." })}
                        className="input" type="text" name="description" minLength={5} placeholder="Description"
                    />
                    <div className="my-10">
                        <h4 className="font-medium mb-3 text-xl">Dish Options</h4>
                        <span onClick={() => onAddOptionClick()}
                            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
                        >
                            Add Dish Option
                        </span>
                        {optionsNumber.length !== 0
                            && optionsNumber.map((id) => (
                                <div key={id} className="mt-5">
                                    <input
                                        {...register(`${id}-optionName`,
                                            // {required: "Option Name is required."}
                                        )}
                                        name={`${id}-optionName`}
                                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3"
                                        type="text" placeholder="Option Name"
                                    />
                                    <input
                                        {...register(`${id}-optionExtra`)}
                                        name={`${id}-optionExtra`}
                                        className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 w-28"
                                        type="number" min={0} defaultValue={0} placeholder="(k VND)"
                                    />
                                    <span
                                        className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-"
                                        onClick={() => onDeleteClick(id)}>Xóa</span>
                                </div>
                            ))
                        }
                    </div>
                    <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
                </form>

            </div>
        </>
    );
}