import { act, fireEvent, getByPlaceholderText, getByTestId, render, waitFor } from "@testing-library/react";
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

    it("should push to search when submit search form", async () => {
        const searchFormProps = {
            searchTerm: "a"
        }

        // mock window.location.reload
        global.window = Object.create(window);
        Object.defineProperty(window, "location", {
            value: {
                reload: () => "location reload",
            },
            writable: true
        });

        const handleSubmit = (onSearchSubmit: Function) => {
            onSearchSubmit();
        }

        const history = createMemoryHistory();

        const { getByRole } = render(
            <Router history={history}>
                <SearchForm searchTerm={searchFormProps.searchTerm} />
            </Router>
        );
        const searchText = "b";
        await act(async () => {
            fireEvent.change(getByRole('searchbox'), { target: { value: "b" } })
            fireEvent.submit(getByRole('form'));
        });
        expect(history.length).toBe(2);
        expect(history.location.pathname).toBe("/search");
        expect(history.location.search).toBe("?term=" + searchText);
    });
})