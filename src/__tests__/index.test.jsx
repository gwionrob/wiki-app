import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "whatwg-fetch";

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUseNavigate,
}));

describe("Home", () => {
    it("renders a heading", () => {
        render(<Home />, { wrapper: Router });

        const heading = screen.getByRole("heading", {
            name: /Passfort\.wiki/i,
        });

        expect(heading).toBeInTheDocument();
    });
});
