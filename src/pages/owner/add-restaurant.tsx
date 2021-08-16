import { useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { CREATE_RESTAURANT_MUTATION } from "../../gql/gql-query";
import { createAccountMutationVariables } from "../../__generated__/createAccountMutation";
import { createRestaurantMutation } from "../../__generated__/createRestaurantMutation";

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
}

export const AddRestaurant = () => {

    const [createRestaurantMutation, {data, loading, error} ] 
        = useMutation<createRestaurantMutation, createAccountMutationVariables >(
            CREATE_RESTAURANT_MUTATION,
        );

    const { register, getValues, formState, handleSubmit } = useForm<IFormProps>(
        { mode: "onChange" }
    );
    const onSubmit = () => {
        console.log(getValues());
    }

    return (
        <div className="container mt-32 mx-5">

            <Helmet>
                <title>Add Restaurant | Nuber Eats</title>
            </Helmet>

            <h1 className="text-4xl font-medium mb-10">Add restaurant</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} >
                <input className="input"
                    {...register("name", {required: "Name is required."})}
                    name = "name" placeholder = "Name" type="text"
                />
                <input className="input"
                    {...register("address", {required: "Address is required."})}
                    name = "address" placeholder = "Address" type="text"
                />
                <input className="input"
                    {...register("categoryName", {required: "Category Name is required."})}
                    name = "categoryName" placeholder = "Category Name" type="text"
                />
                <Button loading={loading} canClick={formState.isValid} actionText="Create Restaurant" />
            </form>

        </div>
    );
}