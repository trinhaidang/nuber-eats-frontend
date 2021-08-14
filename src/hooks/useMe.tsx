import { gql, useQuery } from "@apollo/client";
import { ME_QUERY } from "../gql/gql-query";
import { meQuery } from "../__generated__/meQuery";


export const useMe = () => {
    return useQuery<meQuery>(ME_QUERY);

};