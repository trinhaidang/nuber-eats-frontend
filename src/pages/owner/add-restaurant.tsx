import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { CATEGORIES_QUERY, CREATE_RESTAURANT_MUTATION, MY_RESTAURANTS_QUERY } from "../../gql/gql-query";
import { categoriesQuery } from "../../__generated__/categoriesQuery";
import { capitalizeAllWords } from "../../common/utility";
import { RESTAURANT_COVERIMG_DEFAUT, UPLOAD_URL } from "../../common/constants";
import { useState } from "react";
import { FormError } from "../../components/form-error";
import { createRestaurantMutation, createRestaurantMutationVariables } from "../../__generated__/createRestaurantMutation";
import { useHistory } from "react-router-dom";

// https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
    file: FileList;
}

export const AddRestaurant = () => {

    const client = useApolloClient();
    const history = useHistory();
    const [imageUrl, setImageUrl] = useState("");
    const onCompleted = (data: createRestaurantMutation) => {
        const { createRestaurant: { ok, restaurantId, error } } = data;
        if (error) console.log(error);
        if (ok) {
            setUploading(false);
            console.log(data);
            // update cache with fake restaurant instead of refretch query
            const { name, categoryName, address } = getValues();
            const queryResult = client.readQuery({
                query: MY_RESTAURANTS_QUERY, 
                variables: { input: { page: 1} } 
            });
            console.log(queryResult)
            client.writeQuery({
                query: MY_RESTAURANTS_QUERY,
                variables: { input: { page: 1} },
                data: {
                    myRestaurants: {
                        ...queryResult.myRestaurants,
                        totalResults: queryResult.totalResults + 1,
                        results: [
                            {
                                address,
                                category: { name: categoryName, __typename: "Category" },
                                coverImg: imageUrl,
                                id: restaurantId,
                                isPromoted: false,
                                isValid: true,
                                name,
                                __typename: "Restaurant",
                                
                            },
                            ...queryResult.myRestaurants.results,
                        ],
                        totalPages: queryResult.totalPages,
                        __typename: "MyRestaurantsOutput" 
                    }
                }
            });
            history.push("/");
        };
    };
    const [createRestaurantMutation, { data, error }]
        = useMutation<createRestaurantMutation, createRestaurantMutationVariables>(
            CREATE_RESTAURANT_MUTATION,
            {
                onCompleted,
                // refetchQueries: [{ query: MY_RESTAURANTS_QUERY, 
                //     variables: {
                //         input: { page: 1 }
                //     }
                // }]
            }
        );

    const { data: catData, loading: catLoading, error: catError } = useQuery<categoriesQuery>(
        CATEGORIES_QUERY
    );
    if (catError) console.log("error query categories: ", catError);

    // handle form
    const { register, getValues, formState, handleSubmit } = useForm<IFormProps>(
        { mode: "onChange" }
    );
    const [uploading, setUploading] = useState(false);
    const onSubmit = async () => {
        let coverImg = RESTAURANT_COVERIMG_DEFAUT;
        try {
            // upload file
            setUploading(true);
            const { file, name, categoryName, address } = getValues();
            if (file.length > 0) {
                const actualFile = file[0];
                const formBody = new FormData();
                formBody.append("file", actualFile);
                const { url } = await (
                    await fetch(UPLOAD_URL,
                        {
                            method: "POST",
                            body: formBody
                        }
                    )).json();
                if (url !== null && url !== "") {
                    coverImg = url;
                }
            }
            setImageUrl(coverImg);

            // create query
            const variables = {
                input: {
                    name,
                    categoryName,
                    address,
                    coverImg,
                }
            };
            // console.log(variables);
            createRestaurantMutation({
                variables,
            })

        } catch (error) {
            console.log("upload image error: ", error);
        }
    }


    return (
        <div className=" h-screen flex items-center flex-col mt-10 lg:mt-28">

            <Helmet>
                <title>Add Restaurant | Nuber Eats</title>
            </Helmet>

            <div className="w-full font-medium max-w-screen-sm flex flex-col px-5 items-center">

                <h1 className="text-4xl font-medium mb-10">Add restaurant</h1>

                <form onSubmit={handleSubmit(onSubmit)}
                    className="grid gap-3 mt-5 w-full mb-5">
                    <input className="input"
                        {...register("name", { required: "Name is required." })}
                        name="name" placeholder="Name" type="text"
                    />
                    <input className="input"
                        {...register("address", { required: "Address is required." })}
                        name="address" placeholder="Address" type="text"
                    />

                    {/* {!catLoading && */}
                    <>
                        <select
                            className="input" id="categorySelect"
                            {...register("categoryName", { required: "Category Name is required." })}
                            name="categoryName" placeholder="Category Name"
                        >
                            <option value="" disabled selected>Category Name</option>
                            {catData?.allCategories.categories?.map((category, index) =>
                                <option key={category.name} >{capitalizeAllWords(category.name)}</option>)
                            }
                        </select>
                    </>

                    <div>
                        <input type="file" name="file" accept="image/*"
                            {...register("file",
                                // {required: true}
                            )}
                        />
                    </div>

                    {/* } */}
                    <Button loading={uploading} canClick={formState.isValid} actionText="Create Restaurant" />
                    {data?.createRestaurant?.error && <FormError errorMessage={data?.createRestaurant?.error} />}
                </form>

            </div>

        </div>
    );
}