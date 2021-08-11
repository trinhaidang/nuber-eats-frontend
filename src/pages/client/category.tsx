import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom"
import { CATEGORY_QUERY } from "../../gql/gql-query";
import { category, categoryVariables } from "../../__generated__/category";
import { Helmet } from "react-helmet-async";


interface ICategoryParams {
    slug: string;
}

export const Category = () => {

    const params = useParams<ICategoryParams>();
    const { data, loading, error } = useQuery<category, categoryVariables>(
        CATEGORY_QUERY,
        {
            variables: {
                input: {
                    page: 1,
                    slug: params.slug,
                }
            }
        }
    );
    console.log(data);
    if(error) console.log(error);

    return (
        <div>
            <Helmet>
                <title>Category | Nuber Eats</title>
            </Helmet>
            Category
        </div>
    );
}