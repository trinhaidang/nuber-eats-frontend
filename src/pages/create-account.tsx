import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import nuberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";
import { createAccountMutation, createAccountMutationVariables } from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";

const CREAT_ACCOUNT_MUTATION = gql`
    mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
        createAccount(input: $createAccountInput) {
            ok
            error
        }
    }
`;

interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;
}

export const CreateAccount = () => {

    const role = UserRole.Client;
    const { register, watch, formState: { isValid, errors }, handleSubmit }
        = useForm<ICreateAccountForm>(
            {
                mode: "onChange",
                defaultValues: { role: UserRole.Client }
            }
        );
    const variables = {
        createAccountInput: {
            email: watch("email"),
            password: watch("password"),
            role: watch("role"),
        }
    };
    const onCompleted = ({ createAccount: { ok, error } }: createAccountMutation) => {
        if (ok) {
            console.log("ok");
        }
        if (error) {
            console.log(error);
        }
    };

    const onError = (error: ApolloError) => {
        // error while call backend api ex: 
        console.log("onError: " + error);
    };

    const [createAccountMutation, { data: createAccountMutationResult, loading }] = useMutation<createAccountMutation, createAccountMutationVariables>(
        CREAT_ACCOUNT_MUTATION,
        { variables, onCompleted, onError }
    );

    const onSubmit = () => {
        console.log(watch());
    };
    console.log(watch());

    return (
        <div className=" h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Create Account | Nuber Eats</title>
            </Helmet>
            <div className="w-full font-medium max-w-screen-sm flex flex-col px-5 items-center">
                <img src={nuberLogo} className="w-52 mb-5" />
                <h4 className="w-full text-left text-3xl mb-5">Let's get started</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
                    <input
                        {...register("email", { required: "Email is required" })}
                        required
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="input"
                    />
                    {errors.email?.message && (
                        <FormError errorMessage={errors.email?.message} />
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
                    <select
                        {...register("role", { required: true })}
                        className="input"
                        name="role"
                    >
                        {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
                    </select>
                    <Button canClick={isValid} loading={loading} actionText="Create Account" />

                </form>
                <div>
                    Already have an account?{" "}
                    <Link to="/login" className="text-lime-500 hover:underline">
                        Log in now
                    </Link>
                </div>
            </div>
        </div>
    );
}