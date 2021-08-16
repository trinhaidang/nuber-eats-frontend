import { ApolloClient, InMemoryCache, makeVar, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN, SERVER_URI } from "./common/constants";

const httpLink = createHttpLink({
    uri: SERVER_URI,
});

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

// set default value when start app: if token is null 
// -> isLoggedInVar = False, authToken = null
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

//set context of every request that user makes
const authLink = setContext((_, {headers}) => {
    return {
        headers: {
            ...headers,
            "x-jwt": authTokenVar() || "",
        }
    };
});

export const user = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read(){
                            return isLoggedInVar();
                        }
                    },
                    token: {
                        read(){
                            return authTokenVar();
                        }
                    }
                }
            }
        }
    })
});