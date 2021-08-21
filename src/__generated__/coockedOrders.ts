/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: coockedOrders
// ====================================================

export interface coockedOrders_cookedOrders_driver {
  __typename: "User";
  email: string;
}

export interface coockedOrders_cookedOrders_customer {
  __typename: "User";
  email: string;
}

export interface coockedOrders_cookedOrders_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface coockedOrders_cookedOrders_items_dish {
  __typename: "Dish";
  name: string;
}

export interface coockedOrders_cookedOrders_items_options {
  __typename: "OrderItemOption";
  name: string;
  choice: string | null;
}

export interface coockedOrders_cookedOrders_items {
  __typename: "OrderItem";
  dish: coockedOrders_cookedOrders_items_dish;
  options: coockedOrders_cookedOrders_items_options[] | null;
  quantity: number;
  itemPrice: number;
}

export interface coockedOrders_cookedOrders {
  __typename: "Order";
  id: number;
  createdAt: any;
  status: OrderStatus;
  total: number | null;
  driver: coockedOrders_cookedOrders_driver | null;
  customer: coockedOrders_cookedOrders_customer | null;
  restaurant: coockedOrders_cookedOrders_restaurant | null;
  items: coockedOrders_cookedOrders_items[];
}

export interface coockedOrders {
  cookedOrders: coockedOrders_cookedOrders;
}
