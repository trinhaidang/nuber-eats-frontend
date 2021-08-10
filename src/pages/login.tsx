import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { loginMutation, loginMutationVariables } from "../__generated__/loginMutation";
import nuberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput: LoginInput!) {
        login(input: $loginInput) {
            ok
            token
            error
        }
    }
`;

interface ILoginForm {
    email: string;
    password: string;
}

export const Login = () => {

    const { register, watch, formState: { isValid, errors }, handleSubmit }
        = useForm<ILoginForm>({ mode: "onChange" });
    const variables = {
        loginInput: {
            email: watch("email"),
            password: watch("password"),
        }
    };
    const onCompleted = (data: loginMutation) => {
        const { login: { ok, error, token } } = data;
        // data: response from backend
        if (ok && token) {
            console.log(token);
            localStorage.setItem(LOCALSTORAGE_TOKEN, token);
            authTokenVar(token);
            isLoggedInVar(true);
        }
        if (error) {
            //error field return from backend ex: user not found
            console.log("onCompleted " + error);
        }
    };
    const onError = (error: ApolloError) => {
        // error while call backend api ex: 
        console.log("onError: " + error);
    };

    const [loginMutation, { data: loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(
        LOGIN_MUTATION,
        { variables, onCompleted, onError }
        // loginMutationResult: response from backend -> pass to onCompleted
    );

    const onSubmit = () => {
        if (!loading) {
            loginMutation();
        }
    };

    return (
        <div className=" h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Login | Nuber Eats</title>
            </Helmet>
            <div className="w-full font-medium max-w-screen-sm flex flex-col px-5 items-center">
                <img src={nuberLogo} className="w-52 mb-5" />
                <h4 className="w-full text-left text-3xl mb-5">Welcome back</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
                    <input
                        {   ...register(
                            "email", 
                            { 
                                required: "Email is required", 
                                pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            }
                        )
                        }
                        required
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input"
                    />
                    {errors.email?.message && (
                        <FormError errorMessage={errors.email?.message} />
                    )}
                    {errors.email?.type === "pattern" && (
                        <FormError errorMessage={"Please enter a valid email"} />
                    )}
                    <input
                        {...register("password", { required: "Password is required" })}
                        required
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="input"
                    />
                    {errors.password?.type === "minLength" && (
                        <FormError errorMessage="Password must be more than 10 chars." />
                    )}
                    {errors.password?.message && (
                        <FormError errorMessage={errors.password?.message} />
                    )}
                    <Button canClick={isValid} loading={loading} actionText="Log In" />
                    {loginMutationResult?.login.error &&
                        (<FormError errorMessage={loginMutationResult?.login.error} />)
                    }
                </form>
                <div>
                    New to Nuber?{" "}
                    <Link to="/create-account" className="text-lime-500 hover:underline">
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
}