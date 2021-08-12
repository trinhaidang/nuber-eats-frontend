import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";


interface IFormProps {
    searchTerm: string;
}

export const SearchForm: React.FC<IFormProps> = ({searchTerm}) => {
    /*--- search func  ---*/
    const history = useHistory();

    const { register, getValues, handleSubmit } = useForm<IFormProps>();
    const onSearchSubmit = () => {
        searchTerm = getValues().searchTerm;
        history.push({
            pathname: "/search",
            search: `?term=${searchTerm}`,
        });
        window.location.reload();
    };
    
    return (
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
                placeholder={searchTerm === "" ? "Search restaurants..." : searchTerm}
            />
        </form>
    );
};