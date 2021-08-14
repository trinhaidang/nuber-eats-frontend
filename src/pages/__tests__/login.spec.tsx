import { ApolloError, ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { getByText, render, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { Login } from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { Console, debug } from "console";
import { LOGIN_MUTATION } from "../../gql/gql-query";
import { error } from "console";


describe("<Login />", () => {
    let renderResult : RenderResult;
    let mockedClient: MockApolloClient;

    beforeEach(async () => {
        await waitFor(() => {
            mockedClient = createMockClient();
            renderResult = render(
                <HelmetProvider>
                    <Router>
                        <ApolloProvider client={mockedClient}>
                            <Login />
                        </ApolloProvider>
                    </Router>
                </HelmetProvider>
            );
        });
    });

    it("should render Ok", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Login | Nuber Eats");
        });
    });

    it("displays email validation errors", async () => {
        const { getByPlaceholderText, debug, getByText } = renderResult;
        const email = getByPlaceholderText(/email/i);
        await waitFor(() => {
            userEvent.type(email, "this@wont");
        });
        // debug();
        getByText("Please enter a valid email");
        await waitFor(() => {
            userEvent.clear(email);
        });
        getByText("Email is required");
    });

    it("displays password required errors", async () => {
        const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const submitBtn = getByRole("button");
        await waitFor(() => {
            userEvent.type(email, "this@wont.com");
            userEvent.click(submitBtn);
        });
        // debug();
        getByText(/Password is required/i);
    });

    it("submit form and calls mutation", async () => {
        const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const submitBtn = getByRole("button");
        const formData = {
            email:"real@test.com",
            password:"123",
        };

        // mock mutation
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                login : {
                    ok: true,
                    token: "XXX",
                    error: "mutation-error"  //ok and error mocked only -> never happens
                }
            },
        });
        mockedClient.setRequestHandler(
            LOGIN_MUTATION,
            mockedMutationResponse,
        )

        //spy to test storage
        jest.spyOn(Storage.prototype, "setItem");
        //spy to test storage
        jest.spyOn(Console.prototype, "log");

        await waitFor(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(submitBtn);
        });

        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            loginInput: {
                email: formData.email,
                password: formData.password
            }
        })
        getByText("mutation-error");
        expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "XXX");

    });

})