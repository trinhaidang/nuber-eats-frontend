import { ApolloProvider } from "@apollo/client";
import React from "react";
import { render, RenderResult, waitFor } from "../../common/test-utils";
import { CreateAccount } from "../create-account";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";
import { CREATE_ACCOUNT_MUTATION } from "../../gql/gql-query";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
    const realModule = jest.requireActual("react-router-dom");
    return {
        ...realModule,
        useHistory: () => {
            return {
                push: mockPush,
            };
        },
    };
})

describe("<CreateAccount />", () => {
    
    let mockedClient: MockApolloClient;
    let renderResult : RenderResult;

    beforeEach(async () => {
        mockedClient = createMockClient();
        renderResult = render(
            <ApolloProvider client={mockedClient}>
                <CreateAccount />
            </ApolloProvider>
        );
    });

    it("renders OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("Create Account | Nuber Eats");
        });
    });

    it("renders validation error", async () => {
        const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const submitBtn = getByRole("button");

        // invalid email
        await waitFor(() => {
            userEvent.type(email, "this@wont");
        });
        getByText(/Please enter a valid email/i);

        // obmit email
        await waitFor(() => {
            userEvent.clear(email);
        });
        getByText(/Email is required/i);

        // obmit password
        await waitFor(() => {
            userEvent.type(email,"working@email.com");
            // userEvent.click(submitBtn);
        });
        // getByText(/Password is required/i);
    });

    it("submit form with values", async () => {
        const { getByPlaceholderText, debug, getByText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const submitBtn = getByRole("button");

        const formData = {
            email: "abc@gmail.com",
            password: "123",
            role: "Client"
        }

        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                createAccount: {
                    ok: true,
                    error: "mutation-error"
                }
            }
        });
        mockedClient.setRequestHandler(
            CREATE_ACCOUNT_MUTATION,
            mockedMutationResponse
        );

        jest.spyOn(window, "alert").mockImplementation(() => null);

        await waitFor(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(submitBtn);
        });

        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            createAccountInput: {
                email: formData.email,
                password: formData.password,
                role: formData.role
            }
        });
        expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
        // await waitFor(() => {
        //     userEvent.
        // });
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith("/");
        getByText("mutation-error");
    });
    
    afterAll(() => {
        jest.clearAllMocks();
    })
});
