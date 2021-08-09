import { ApolloError, gql, useMutation } from "@apollo/client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import { loginMutation, loginMutationVariables } from "../__generated__/loginMutation";

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

    const { register, watch, formState: { errors }, handleSubmit } = useForm<ILoginForm>();
    const variables = {
        loginInput: {
            email: watch("email"),
            password: watch("password"),
        }
    };
    const onCompleted = (data: loginMutation) => {
        const { login: { ok, error, token } } = data;
        // data: response from backend
        if (ok) {
            console.log(token);
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
        if(!loading) {
            loginMutation();
        }
    };

    return <div className=" h-screen flex items-center justify-center bg-gray-800 ">
        <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
            <h3 className="text-2xl text-gray-800">Log In</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
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
                <button className="btn mt-3">
                    {loading ? "Loading..." : "Log In"}
                </button>
                {loginMutationResult?.login.error &&
                    (<FormError errorMessage={loginMutationResult?.login.error} />)
                }
            </form>
        </div>

    </div>;
}