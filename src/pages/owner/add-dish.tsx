import { useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm, useFormState } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { CREATE_DISH_MUTATION, MY_RESTAURANT_QUERY } from "../../gql/gql-query";
import { createDish, createDishVariables } from "../../__generated__/createDish";


interface IParams {
    restaurantId: string
}

interface IFormProps {
    name: string;
    price: string;
    description: string;
}

export const AddDish = () => {

    const {restaurantId} = useParams<IParams>();
    const [createDishMutation, {loading}] = useMutation<createDish, createDishVariables>(
        CREATE_DISH_MUTATION,
        { refetchQueries: [{ 
            query: MY_RESTAURANT_QUERY,
            variables: { input: { id: +restaurantId } }
        }]}
    );

    const history = useHistory();
    const onSubmit = () => {
        const {name, price, description} = getValues();
        createDishMutation({
            variables: {
                input: {
                    name,
                    price: +price,
                    description,
                    restaurantId: +restaurantId,
                }
            }
        });
        history.goBack();
    };
    const {register, handleSubmit, formState, getValues} = useForm<IFormProps>({mode:"onChange"});
    
    return (
        <div className=" h-screen flex items-center flex-col mt-10 lg:mt-28 mx-5">
            <Helmet>
                <title>Add Dish | Nuber Eats</title>
            </Helmet>

            <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
            <form onSubmit={handleSubmit(onSubmit)}
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
            >
                <input
                    {...register("name", {required: "Name is required."})}
                    className="input" type="text" name="name" placeholder="Name"
                />
                <input
                    {...register("price", {required: "Price is required."})}
                    className="input" type="number" name="price" min={0} placeholder="Price"
                />
                <input
                    {...register("description", {required: "Description is required."})}
                    className="input" type="text" name="description" minLength={5} placeholder="Description"
                />
                <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
            </form>

        </div>
    );
}