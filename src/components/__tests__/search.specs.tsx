import { fireEvent, getByPlaceholderText, getByTestId, render } from "@testing-library/react";
import React from "react";
import { useForm } from "react-hook-form";
import { Router } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { SearchRestaurant } from "../../pages/client/search";
import { SearchForm } from "../search";
import { createMemoryHistory } from 'history'

describe("<SearchRestaurant />", () => {
    it("should render OK with search term", () => {
        const searchFormProps = {
            searchTerm: "a"
        }

        const { getByRole } = render(
            <BrowserRouter >
                <SearchForm searchTerm={searchFormProps.searchTerm} />
            </BrowserRouter>
        );
        // debug();
        expect(getByRole('searchbox').getAttribute('placeholder')).toMatch(searchFormProps.searchTerm); 
    });

    it("should render without search term", () => {
        const searchFormProps = {
            searchTerm: ""
        }

        const { getByRole } = render(
            <BrowserRouter >
                <SearchForm searchTerm={searchFormProps.searchTerm} />
            </BrowserRouter>
        );
        // debug();
        expect(getByRole('searchbox').getAttribute('placeholder')).toMatch("Search restaurants..."); 
    });

    it("should push to search when submit search form", () => {
        const searchFormProps = {
            searchTerm: "a"
        }

        // mock window.location.reload
        global.window = Object.create(window);
        Object.defineProperty(window, "location", {
            value: {
                reload : () => "location reload",
            },
            writable: true
        });

        const history = createMemoryHistory();
        const { getByRole } = render(
            <Router history={history}>
                <SearchForm searchTerm={searchFormProps.searchTerm} />
            </Router>
        );
        const searchText = "b";
        fireEvent.change(getByRole('searchbox'), { target: { value: "b" } })
        fireEvent.submit(getByRole('form'))
        // console.log(history);
        expect(history.length).toBe(2);
        expect(history.location.pathname).toBe("/search");
        expect(history.location.search).toBe("?term=" + searchText);
    });
})