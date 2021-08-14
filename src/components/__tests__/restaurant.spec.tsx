import { render } from "@testing-library/react";
import React from "react";
import { RestaurantItem } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";
import { capitalizeAllWords } from "../../common/utility";

describe("<Restaurant />", () => {
    it("should render OK with props", () => {
        const restaurantProps = {
            id:"1",
            name:"nameTest",
            categoryName:"catTest",
            coverImg:"x.png"
        }
        const { debug, getByText, container } = render(
            <Router>
                <RestaurantItem {...restaurantProps} />
            </Router>
        );
        getByText(restaurantProps.name);
        getByText(capitalizeAllWords(restaurantProps.categoryName));  // capitalize category
        expect(container.firstChild).toHaveAttribute("href", `/restaurants/${restaurantProps.id}`);
    })
})