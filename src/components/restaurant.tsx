import { Link } from "react-router-dom";
import { capitalizeAllWords } from "../common/utility";


interface IRestaurantProps {
    id: string;
    name: string;
    categoryName?: string;
    coverImg?: string;
}


export const Restaurant: React.FC<IRestaurantProps> = ({ id, name, categoryName, coverImg }) => (
    <Link to={`/restaurants/${id}`}>
        <div className="flex flex-col">
            <div
                className="bg-cover bg-center mb-3 py-28"
                style={{ backgroundImage: `url(${coverImg})`, }}
            ></div>
            <h3 className="text-xl font-medium">{name}</h3>
            <span className="border-t mt-3 py-2 text-xs opacity-50 border-gray-400">{capitalizeAllWords(categoryName)}</span>
        </div>
    </Link>
);