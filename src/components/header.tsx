import React from "react";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPowerOff, faStore, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


export const Header = () => {
    const { data } = useMe();
    return (
        <>
            {!data?.me.verified && (
                <div className="bg-red-500 p-3 text-center text-base text-white">
                    <span>Please verify your email.</span>
                </div>
            )}
            <header className="py-4">
                <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
                <Link to="/"><img src={nuberLogo} className="w-36" alt="Nuber Eats" /></Link>
                    <div className="flex justify-between text-xs">
                        <Link to="/">
                            <FontAwesomeIcon icon={faStore} className="text-lg mx-4" />{" "}
                        </Link>
                        <Link to="/edit-profile/">
                            <FontAwesomeIcon icon={faUser} className="text-lg mx-2" />{" "}
                        </Link>
                        <Link to="/logout">
                            <FontAwesomeIcon icon={faPowerOff} className="text-lg ml-2" />{" "}
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};