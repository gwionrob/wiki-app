import { render } from "@testing-library/react";
import { Home, Page, EditPage } from "../pages/index";
import { BrowserRouter as Router } from "react-router-dom";
import "whatwg-fetch";

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedUseNavigate,
}));

it("renders homepage unchanged", () => {
    const { container } = render(<Home />, { wrapper: Router });
    expect(container).toMatchSnapshot();
});

it("renders page unchanged", () => {
    const { container } = render(<Page />, { wrapper: Router });
    expect(container).toMatchSnapshot();
});

it("renders editpage unchanged", () => {
    const { container } = render(<EditPage />, { wrapper: Router });
    expect(container).toMatchSnapshot();
});
