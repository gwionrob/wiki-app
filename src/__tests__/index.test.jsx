import { render, screen } from "@testing-library/react";
import { Home, Page, EditPage } from "../pages/index";
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

describe("Page", () => {
    it("renders buttons", () => {
        render(<Page />, { wrapper: Router });

        const editPage = screen.getByRole("link", {
            name: /Edit Page/i,
        });
        const returnHome = screen.getByRole("link", {
            name: /Return Home/i,
        });

        expect(editPage).toBeInTheDocument();
        expect(returnHome).toBeInTheDocument();
    });
});

describe("EditPage", () => {
    it("renders buttons", () => {
        render(<EditPage />, { wrapper: Router });

        const create = screen.getByRole("button", {
            name: /Create/i,
        });
        const discard = screen.getByRole("button", {
            name: /Discard/i,
        });

        expect(create).toBeInTheDocument();
        expect(discard).toBeInTheDocument();
    });
});
