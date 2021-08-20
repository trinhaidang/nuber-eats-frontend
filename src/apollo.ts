import { ApolloClient, InMemoryCache, makeVar, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN, SERVER_URI, WS_URI } from "./common/constants";
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
    uri: SERVER_URI,
});

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);

// set default value when start app: if token is null 
// -> isLoggedInVar = False, authToken = null
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

//set context of every request that user makes
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            "x-jwt": authTokenVar() || "",
        }
    };
});

const wsLink = new WebSocketLink({
    uri: WS_URI,
    options: {
        reconnect: true,
        connectionParams: {
            "x-jwt": authTokenVar() || "",
        }
    }
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink),
);

export const user = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read() {
                            return isLoggedInVar();
                        }
                    },
                    token: {
                        read() {
                            return authTokenVar();
                        }
                    }
                }
            }
        }
    })
});