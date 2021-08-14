import { render, waitFor } from "@testing-library/react";
import React from "react";
import { Header } from "../header";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { ME_QUERY } from "../../gql/gql-query"

describe("<Header />", () => {
    it("renders verify banner", async () => {
        await waitFor(async () => {
            const { debug, getByText } = render(
                <MockedProvider
                    mocks={[
                        {
                            request: {
                                query: ME_QUERY,
                            },
                            result: {
                                data: {
                                    me: {
                                        id: 1,
                                        email: "",
                                        role: "",
                                        verified: false,
                                    }
                                }
                            }
                        }
                    ]}
                >
                    <Router>
                        <Header />
                    </Router>
                </MockedProvider>
            );
            await new Promise((resolve) => setTimeout(resolve, 0));
            // debug();
            getByText("Please verify your email.");
        })
    });


    it("renders without verify banner", async () => {
        await waitFor(async () => {
            const { debug, queryByText } = render(
                <MockedProvider
                    mocks={[
                        {
                            request: {
                                query: ME_QUERY,
                            },
                            result: {
                                data: {
                                    me: {
                                        id: 1,
                                        email: "",
                                        role: "",
                                        verified: true,
                                    }
                                }
                            }
                        }
                    ]}
                >
                    <Router>
                        <Header />
                    </Router>
                </MockedProvider>
            );
            await new Promise((resolve) => setTimeout(resolve, 10));
            // debug();
            expect(queryByText("Please verify your email.")).toBeNull();
        })
    });
})