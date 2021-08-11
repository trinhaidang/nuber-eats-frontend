import { useEffect } from "react";
import { useLocation } from "react-router-dom"


export const SearchRestaurant = () => {
    const location = useLocation();
    useEffect(() => {
        console.log(location);
    }, []);
    return (
        <div>Search Restaurants here</div>
    );
};