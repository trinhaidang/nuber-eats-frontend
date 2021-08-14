import { render } from "@testing-library/react";
import React from "react";
import { Categories } from "../categories";
import { BrowserRouter as Router } from "react-router-dom";
import { capitalizeAllWords } from "../../common/utility";
import {restaurantsPageQuery_allCategories_categories} from "../../__generated__/restaurantsPageQuery";
import { CATEGORY_COVERIMG_DEFAUT } from "../../common/constants";


describe("<Categories />", () => {
    it("should render OK with props", () => {
        const categories : restaurantsPageQuery_allCategories_categories[] = [
            {
                __typename: "Category",
                id: 1,
                slug: "slug1",
                name: "cat1",
                coverImg: "img1",
                restaurantCount: 1
            },
            {
                __typename: "Category",
                id: 2,
                slug: "slug2",
                name: "cat2",
                coverImg: "img2",
                restaurantCount: 2
            }
        ]

        const categoriesProps = {
            categories: categories,
            currentCategoryId: null
        }
        const { debug, getByText, container } = render(
            <Router>
                <Categories categories={categoriesProps.categories} currentCategoryId={categoriesProps.currentCategoryId} />
            </Router>
        );
        categories.map((cat, index) => {
            expect(container.firstChild?.childNodes[index]).toHaveAttribute("href", `/category/${cat.slug}`);
            expect(container.firstChild?.childNodes[index].childNodes[0].childNodes[0]).toHaveAttribute("style", `background-image: url(${cat.coverImg});`);
            getByText(capitalizeAllWords(cat.name));
            expect(container.firstChild?.childNodes[index].childNodes[0].childNodes[0]).not.toHaveClass("bg-gray-300");
        })
    });

    it("should render default img without coverImg", () => {
        const categories : restaurantsPageQuery_allCategories_categories[] = [
            {
                __typename: "Category",
                id: 1,
                slug: "slug1",
                name: "cat1",
                coverImg: null,
                restaurantCount: 1
            }
        ]

        const categoriesProps = {
            categories: categories,
            currentCategoryId: null
        }
        const { debug, getByText, container } = render(
            <Router>
                <Categories categories={categoriesProps.categories} currentCategoryId={categoriesProps.currentCategoryId} />
            </Router>
        );
        categories.map((cat, index) => {
            expect(container.firstChild?.childNodes[index].childNodes[0].childNodes[0]).toHaveAttribute("style", `background-image: url(${CATEGORY_COVERIMG_DEFAUT});`);
        })
    });


    it("should render gray background on current category", () => {
        const categories : restaurantsPageQuery_allCategories_categories[] = [
            {
                __typename: "Category",
                id: 1,
                slug: "slug1",
                name: "cat1",
                coverImg: "img1",
                restaurantCount: 1
            }
        ]

        const categoriesProps = {
            categories: categories,
            currentCategoryId: 1
        }
        const { debug, getByText, container } = render(
            <Router>
                <Categories categories={categoriesProps.categories} currentCategoryId={categoriesProps.currentCategoryId} />
            </Router>
        );
        categories.map((cat, index) => {
            expect(container.firstChild?.childNodes[index].childNodes[0].childNodes[0]).toHaveClass("bg-gray-300");
        })
    });


})