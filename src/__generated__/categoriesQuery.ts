/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: categoriesQuery
// ====================================================

export interface categoriesQuery_allCategories_categories {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface categoriesQuery_allCategories {
  __typename: "AllCategoriesOutput";
  ok: boolean;
  error: string | null;
  categories: categoriesQuery_allCategories_categories[] | null;
}

export interface categoriesQuery {
  allCategories: categoriesQuery_allCategories;
}
