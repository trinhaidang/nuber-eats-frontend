import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormError } from "../../components/form-error";
import { useMe } from "../../hooks/useMe";
import { verifyEmail, verifyEmailVariables } from "../../__generated__/verifyEmail";
import { Helmet } from "react-helmet-async";
import { VERIFY_EMAIL_MUTATION } from "../../gql/gql-query";


export const ConfirmEmail = () => {

    // if response ok, overwrite User object in cache
    const { data: userData, refetch } = useMe();
    const client = useApolloClient();
    const history = useHistory();
    const onCompleted = (data: verifyEmail) => {
        const { verifyEmail: { ok, error } } = data;
        if (ok && userData?.me.id) {
            client.writeFragment({
                id: `User:${userData?.me.id}`,    //whole id in cache vd User:1
                fragment: gql`fragment VerifiedUser on User { verified }`,
                data: { verified: true },
            });
            history.push("/");
        }

    }

    const [verifyEmail, { data: verifyResult, error }]
        = useMutation<verifyEmail, verifyEmailVariables>(
            VERIFY_EMAIL_MUTATION,
            { onCompleted, }
        );

    useEffect(() => {
        const [_, code] = window.location.href.split("code=");
        verifyEmail({
            variables: {
                input: {
                    code,
                }
            }
        });
    }, []);

    return (
        <div className="mt-52 flex flex-col items-center justify-center">
            <Helmet>
                <title>Verify Email | Nuber Eats</title>
            </Helmet>
            <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
            <h4 className="text-gray-700 text-sm">Please wait, don't close this page...</h4>
            {error && (
                <FormError errorMessage={error.message} />
            )}
            {verifyResult?.verifyEmail.error && (
                <FormError errorMessage={verifyResult?.verifyEmail.error} />
            )}
        </div>
    );
}