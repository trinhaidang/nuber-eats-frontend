import React from "react";

interface IDishOptionProps {
    dishId: number;
    isSelected: boolean;
    name: string;
    extra?: number | null;
    addOptionToItem: (dishId: number, optionName: any) => void;
    // removeOptionFromItem: (dishId: number, optionName: any) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
    dishId,
    isSelected,
    name,
    extra,
    addOptionToItem,
    // removeOptionFromItem 
}) => {
    const onClick = () => {
        addOptionToItem(dishId, name);
        // if(isSelected) {
        //     removeOptionFromItem(dishId, name);
        // } else {
        //     addOptionToItem(dishId, name);
        // }
    };

    return (
        <span
            onClick={onClick}
            className={`grid grid-flow-col gap-1 col-span-3 border px-2 py-1 ${isSelected ? "border-gray-800" : "hover:border-gray-800" }`}
        >
            <h6 className="text-sm mr-5">{name}</h6>
            {extra && <h6 className="text-sm opacity-75">(+ {extra}K)</h6>}
        </span>
    );
}