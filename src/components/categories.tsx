import React from "react";
import { CATEGORY_COVERIMG_DEFAUT } from "../common/constants";
import { capitalizeAllWords } from "../common/utility";
import { Link } from "react-router-dom";
import {restaurantsPageQuery_allCategories_categories} from "../__generated__/restaurantsPageQuery";

interface ICategoriesParams {
    categories: restaurantsPageQuery_allCategories_categories[] | null | undefined;
    currentCategoryId: Number | null ;
}

export const Categories: React.FC<ICategoriesParams> = ({categories, currentCategoryId}) => (
    <div className="flex justify-around  mx-auto overflow-scroll">
        {categories?.map((category) => {
            const img = category.coverImg || CATEGORY_COVERIMG_DEFAUT;
            return (
                <Link key={category.id} to={`/category/${category.slug}`}>
                    <div className="group flex flex-col items-center cursor-pointer">
                        <div
                            className={"w-16 h-14 bg-cover group-hover:bg-gray-200 rounded-full " + (currentCategoryId === category.id ? "bg-gray-300" : "") }
                            style={{ backgroundImage: `url(${img})`, }}
                        >
                        </div>
                        <span className="mt-1 text-sm text-center font-medium">{capitalizeAllWords(category.name)}</span>
                    </div>
                </Link>
            );
        })}
    </div>
);