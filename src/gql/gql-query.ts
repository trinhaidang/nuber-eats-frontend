import { gql } from "@apollo/client";
import { CATEGORY_FRAGMENT, DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDER_FRAGMENT, RESTAURANT_FRAGMENT } from "../gql/fragments";

export const ME_QUERY = gql`
query meQuery {
    me {
        id
        email
        role 
        verified
    }
}
`;

export const LOGIN_MUTATION = gql`
mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
        ok
        token
        error
    }
}
`;

export const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
        createAccount(input: $createAccountInput) {
            ok
            error
        }
    }
`;

export const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input: EditProfileInput!) {
        editProfile(input: $input) {
            ok
            error
        }
    }
`;

export const VERIFY_EMAIL_MUTATION = gql`
    mutation verifyEmail($input: VerifyEmailInput!) {
        verifyEmail(input: $input){
            ok
            error
        }
    }
`;

export const GET_ORDER_QUERY = gql`
    query getOrder($input: GetOrderInput!) {
        getOrder(input: $input) {
            ok
            error
            order {
                ...FullOrderParts
            }
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;

export const EDIT_ORDER_MUTATION = gql`
    mutation editOrder($input: EditOrderInput!) {
        editOrder(input: $input) {
            ok
            error
        }
    }
`;

// -----------------  CLIENT QUERIES -----------------//

export const CATEGORIES_QUERY = gql`
    query categoriesQuery {
        allCategories {
            ok
            error
            categories {
                ...CategoryParts
            }
        }
    }
    ${CATEGORY_FRAGMENT}
`;

export const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!) {
        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`;

// export const RESTAURANTS_QUERY = gql`
//     query restaurantsPageQuery($input: RestaurantsInput!) {
//         allCategories {
//             ok
//             error
//             categories {
//                 ...CategoryParts
//             }
//         }
//         restaurants(input: $input) {
//             ok
//             error
//             totalPages
//             totalResults
//             results {
//                 ...RestaurantParts
//             }
//         }
//     }
//     ${RESTAURANT_FRAGMENT}
//     ${CATEGORY_FRAGMENT}
// `;

export const SEARCH_RESTAURANT = gql`
    query searchRestaurant($input: SearchRestaurantInput!) {
        searchRestaurant(input: $input) {
            ok
            error
            totalPages
            totalResults 
            restaurants {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`;

export const CATEGORY_QUERY = gql`
    query category($input: CategoryInput!) {
        category(input: $input) {
            ok
            error
            totalPages
            totalResults
            category {
                ...CategoryParts
            }
            restaurants {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`;

export const RESTAURANT_QUERY = gql`
    query restaurant($input: RestaurantInput!) {
        restaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
`;

// MAKE Order QUERY

export const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($input: CreateOrderInput!) {
        createOrder(input: $input) {
            ok
            error
            orderId
        }
    }
`;


// -----------------  OWNER QUERIES -----------------//

export const MY_RESTAURANTS_QUERY = gql`
    query myRestaurantsPageQuery($input: MyRestaurantsInput!) {
        myRestaurants (input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
`;

export const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurantMutation($input: CreateRestaurantInput!) {
        createRestaurant(input: $input) {
            ok
            error
            restaurantId
        }
    }
`;

export const MY_RESTAURANT_QUERY = gql`
    query myRestaurant($input: MyRestaurantInput!) {
        myRestaurant(input: $input) {
            ok
            error
            restaurant {
                ...RestaurantParts
                menu {
                    ...DishParts
                }
                orders {
                    ...OrderParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
    ${ORDER_FRAGMENT}
`;

export const CREATE_DISH_MUTATION = gql`
    mutation createDish($input: CreateDishInput!) {
        createDish(input: $input) {
            ok
            error
        }
    }
`;

// -----------------  DRIVER QUERIES -----------------//


export const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;



// -----------------  SUBSCRIPTION QUERIES -----------------//

export const ORDER_SUBSCRIPTION = gql`
    subscription orderUpdates($input: OrderUpdatesInput!) {
        orderUpdates(input: $input) {
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;