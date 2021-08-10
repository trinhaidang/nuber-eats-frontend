import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

// set default value when start app: if token is null 
// -> isLoggedInVar = False, authToken = null
export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);

console.log("default value of authToken is: ", authToken());
console.log("default value of isLoggedInVar is: ", isLoggedInVar());

export const client = new ApolloClient({
    uri: "http://localhost:4000/graphql",
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
                            return authToken();
                        }
                    }
                }
            }
        }
    })
});