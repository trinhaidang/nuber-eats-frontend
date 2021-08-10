import { gql, useApolloClient, useMutation } from "@apollo/client";
import { watch } from "fs";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { EMAIL_REGEX } from "../../constants";
import { useMe } from "../../hooks/useMe";
import { editProfile, editProfileVariables } from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input: EditProfileInput!) {
        editProfile(input: $input) {
            ok
            error
        }
    }
`;

interface IEditProfileFormProps {
    email?: string;
    password?: string;
}

export const EditProfile = () => {
    const client = useApolloClient();

    // form action
    const { data: userData, refetch } = useMe();
    const { register, handleSubmit, getValues, formState: { isValid, errors } } = useForm<IEditProfileFormProps>({
        defaultValues: {
            email: userData?.me.email,
            password: "",
        },
        mode: "onChange"
    });
    const onSubmit = () => {
        const { email, password } = getValues();
        // call mutation
        if(getValues().password || getValues().email){
            performEditProfile({
                variables: {
                    input: {
                        ...((email !== "" && email !== userData?.me.email) && { email }),
                        ...(password !== "" && { password }),
                    }
                }
            });
        }
    }

    //onSubmit perform mutation & update cache
    const onCompleted = async (editProfileResult: editProfile) => {
        const { editProfile: { ok, error } } = editProfileResult;
        if (ok && userData) {
            //after mutation update cache: if email change update user email and verified
            const {email: newEmail} = getValues();
            if(userData.me.email !== newEmail){
                // client.writeFragment({
                //     id: `User:${userData?.me.id}`,    //whole id in cache vd User:1
                //     fragment: gql`fragment EditedUser on User { verified email }`,
                //     data: { verified: false, email: newEmail },
                // });
                await refetch();
            }
        }
        if (error) console.log(error);
    };
    const [performEditProfile, { data:editResult, loading, error }] = useMutation<editProfile, editProfileVariables>(
        EDIT_PROFILE_MUTATION,
        { onCompleted }
    );


    return (
        <div className="mt-5 flex flex-col justify-center items-center">
            <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
                <input
                    {...register("email", { pattern: EMAIL_REGEX })}
                    name="email" className="input" type="email" placeholder="Email" />
                {errors.email?.type === "pattern" && (
                    <FormError errorMessage={"Please enter a valid email"} />
                )}
                <input
                    {...register("password", {})}
                    className="input" type="password" placeholder="Password" />
                <Button loading={loading} canClick={!loading && isValid} actionText="Save Profile" />

                {error && (
                    <FormError errorMessage={error.message} />
                )}
                {editResult?.editProfile.error &&
                        (<FormError errorMessage={editResult?.editProfile.error} />)
                    }
            </form>
        </div>
    );
};