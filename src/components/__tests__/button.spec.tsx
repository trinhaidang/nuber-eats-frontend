import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("<Button />", () => {
    it("should render OK with props", () => {
        const { getByText } = render(
            <Button canClick={true} loading={false} actionText="test" />
        );
        getByText("test");
    });

    it("should display loading when loading is true", () => {
        const { getByText } = render(
            <Button canClick={true} loading={true} actionText="test" />
        );
        getByText("Loading...");
    });

    it("should be disabled when canClick is false", () => {
        const { container } = render(
            <Button canClick={false} loading={false} actionText="test" />
        );
        expect(container.firstChild).toHaveClass("pointer-events-none");
    })
})