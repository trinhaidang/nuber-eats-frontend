/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantsPageQuery
// ====================================================

export interface restaurantsPageQuery_restaurants_results_category {
  __typename: "Category";
  name: string;
}

export interface restaurantsPageQuery_restaurants_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantsPageQuery_restaurants_results_category | null;
  address: string;
  isPromoted: boolean;
  isValid: boolean;
}

export interface restaurantsPageQuery_restaurants {
  __typename: "RestaurantsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  results: restaurantsPageQuery_restaurants_results[] | null;
}

export interface restaurantsPageQuery {
  restaurants: restaurantsPageQuery_restaurants;
}

export interface restaurantsPageQueryVariables {
  input: RestaurantsInput;
}
