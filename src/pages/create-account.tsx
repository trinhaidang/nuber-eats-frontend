import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createAccountMutation, createAccountMutationVariables } from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";
import { EMAIL_REGEX, LOGO_IMG } from "../common/constants";
import { CREATE_ACCOUNT_MUTATION } from "../gql/gql-query";


interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole;
}

export const CreateAccount = () => {

    const { register, getValues, watch, formState: { isValid, errors }, handleSubmit }
        = useForm<ICreateAccountForm>(
            {
                mode: "onChange",
                defaultValues: { role: UserRole.Client }
            }
        );
    const onSubmit = () => {
        console.log(watch());
        if (!loading) {
            const { email, password, role } = getValues();
            createAccountMutation({
                variables: {
                    createAccountInput: { email, password, role }
                }
            });
        }
    };

    const History = useHistory();
    const onCompleted = (data: createAccountMutation) => {
        const { createAccount: { ok, error } } = data;
        if (ok) {
            alert("Account Created! Log in now!");
            History.push("/");
        }
        if (error) {
            console.log(error);
        }
    };
    const onError = (error: ApolloError) => {
        console.log("onError: " + error);
    };

    const [createAccountMutation, { data: createAccountMutationResult, loading }] = useMutation<createAccountMutation, createAccountMutationVariables>(
        CREATE_ACCOUNT_MUTATION,
        { onCompleted, onError }
    );

    return (
        <div className=" h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Create Account | Nuber Eats</title>
            </Helmet>
            <div className="w-full font-medium max-w-screen-sm flex flex-col px-5 items-center">
                <img src={LOGO_IMG} className="w-52 mb-5" alt="Nuber Eats" />
                <h4 className="w-full text-left text-3xl mb-5">Let's get started</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
                    <input
                        {...register(
                            "email",
                            {
                                required: "Email is required",
                                pattern: EMAIL_REGEX,
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
                    <select
                        {...register("role", { required: true })}
                        className="input"
                        name="role"
                    >
                        {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
                    </select>
                    <Button canClick={isValid} loading={loading} actionText="Create Account" />

                    {createAccountMutationResult?.createAccount.error &&
                        (<FormError errorMessage={createAccountMutationResult?.createAccount.error} />)
                    }
                </form>
                <div>
                    Already have an account?{" "}
                    <Link to="/" className="text-lime-500 hover:underline">
                        Log in now
                    </Link>
                </div>
            </div>
        </div>
    );
}