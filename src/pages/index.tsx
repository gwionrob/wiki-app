import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import type { NextPage } from "next";
import type { FunctionComponent } from "react";

type Pages = {
    titles: Array<string>;
};

type PageData = {
    data: string;
    title: string;
};

type RevisionsData = {
    revisions: Array<number>;
};

const Home: NextPage = () => {
    const [titles, setTitles] = useState<Array<string>>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/pages")
            .then((res) => res.json().then((data) => data as Pages))
            .then((data) => {
                setTitles(data.titles);
            })
            .catch((error) => console.log(error));
    }, [navigate]);

    return (
        <div className="m-4 flex flex-col font-mono">
            <h1
                className="cursor-pointer text-center text-2xl"
                onClick={() => navigate("/")}
            >
                Passfort.wiki
            </h1>

            <Routes>
                <Route path="/" element={<Content titles={titles} />} />
                <Route path="/page/:title" element={<Page />} />
                <Route path="/create/:title?" element={<EditPage />} />
            </Routes>
        </div>
    );
};

const Content: FunctionComponent<Pages> = ({ titles }) => {
    const links = [];

    for (const title of titles) {
        links.push(
            <Link
                className="mb-2 cursor-pointer"
                to={`page/${title}`}
                key={title}
            >
                {"\u2022 " + title}
            </Link>,
        );
    }

    return (
        <div>
            <h1 className="mb-2">Welcome to Passfort.wiki</h1>
            <div id="content-list">
                <ul className="flex flex-col">{links}</ul>
            </div>
            <Link className="mb-2 cursor-pointer" to={"/create"} key="create">
                Create new page
            </Link>
        </div>
    );
};

const Page: FunctionComponent = () => {
    const { title } = useParams();
    const [content, setContent] = useState("");
    const [revision, setRevision] = useState<string>("latest");
    const [revisions, setRevisions] = useState<Array<number>>([]);

    useEffect(() => {
        Promise.all([
            fetch(`/api/page/${title ?? ""}/${revision}`),
            fetch(`/api/page/${title ?? ""}`),
        ])
            .then(([resContent, resRevisions]) =>
                Promise.all([
                    resContent.json().then((data) => data as PageData),
                    resRevisions.json().then((data) => data as RevisionsData),
                ]),
            )
            .then(([dataContent, dataRevisions]) => {
                setContent(dataContent.data);
                setRevisions(dataRevisions.revisions.reverse());
            })
            .catch(() => setContent("Page not found..."));
    }, [title, revision]);

    const revisionSelect = (
        <select onChange={(event) => setRevision(event.target.value)}>
            {revisions.map((revision, index) => (
                <option value={revision} key={index}>
                    {new Date(revision * 1000).toString()}
                </option>
            ))}
        </select>
    );

    return (
        <div>
            <h1>{content}</h1>
            {revisionSelect}
            <Link className="" to="/" key={"home"}>
                Return Home
            </Link>
            <Link className="" to={`/create/${title ?? ""}`} key={"change"}>
                Change Page
            </Link>
        </div>
    );
};

const EditPage: FunctionComponent = () => {
    const { title } = useParams();
    const [content, setContent] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (title ? title.length : false) {
            fetch(`/api/page/${title ?? ""}/latest`)
                .then((res) => res.json().then((data) => data as PageData))
                .then((data) => {
                    setContent(data.data);
                })
                .catch((error) => console.log(error));
        }
    }, [title]);

    const handleEditPage = () => {
        const change = newTitle.length ? newTitle : title ?? "";
        fetch(`/api/page/${change}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                page: inputRef.current !== null ? inputRef.current.value : "",
            }),
        })
            .then((res) => console.log(res))
            .catch(() => console.log("Page creation / edit failed."));

        navigate(`../../page/${change}`);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <input
                className="mt-5 w-3/4 rounded-md border-2 border-red-300"
                placeholder="Input page content here..."
                defaultValue={content}
                ref={inputRef}
            />
            <div className="mt-5 flex w-fit flex-row justify-evenly">
                {title?.length ? null : (
                    <input
                        placeholder="Page Name:"
                        className="w-1/2 rounded-md border-2 border-red-300"
                        onChange={(event) =>
                            setNewTitle(event.currentTarget.value)
                        }
                    />
                )}
                <button className="" onClick={handleEditPage}>
                    Create
                </button>
                <button
                    className=""
                    onClick={() =>
                        navigate(
                            newTitle.length
                                ? "../../"
                                : `../../page/${title ?? ""}`,
                        )
                    }
                >
                    Discard
                </button>
            </div>
        </div>
    );
};

export default Home;
