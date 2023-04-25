import { useEffect, useRef, useState } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import type { NextPage } from "next";
import type { FormEvent, FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

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

export const Home: NextPage = () => {
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
        <div className="m-5 flex flex-col items-center font-mono">
            <div id="top-bar" className="mb-5 flex justify-center">
                <h1
                    className="w-fit cursor-pointer text-center text-2xl hover:font-bold"
                    onClick={() => navigate("/")}
                >
                    Passfort.wiki
                </h1>
            </div>

            <Routes>
                <Route path="/" element={<Content titles={titles} />} />
                <Route path="/page/:title/:revision?" element={<Page />} />
                <Route path="/create/:title?" element={<EditPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
};

const Content: FunctionComponent<Pages> = ({ titles }) => {
    const links = [];

    for (const title of titles) {
        links.push(
            <li className="mb-2" key={title}>
                <Link
                    className="cursor-pointer hover:font-bold"
                    to={`page/${title}`}
                >
                    {title}
                </Link>
            </li>,
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
                Welcome to Passfort.wiki, please select from the below pages, or
                create your own!
            </div>
            <article
                id="content-list"
                className="prose m-10 w-full border-b-2 border-t-2 pb-4"
            >
                <ul className="flex flex-col">{links}</ul>
                <Link
                    className="ml-2 cursor-pointer rounded-md border-2 border-blue-700 p-2 text-blue-700 no-underline enabled:hover:font-bold disabled:cursor-auto disabled:border-gray-400 disabled:text-gray-400"
                    to={"/create"}
                    key="create"
                >
                    Create New Page
                </Link>
            </article>
        </div>
    );
};

export const Page: FunctionComponent = () => {
    const { title, revision } = useParams();
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const [revisions, setRevisions] = useState<Array<number>>([]);

    useEffect(() => {
        Promise.all([
            fetch(`/api/page/${title ?? ""}/${revision ?? "latest"}`),
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
            .catch(() =>
                setContent(
                    `Page: ${
                        title ?? ""
                    } not found, select Edit Page above to create it, or Return Home to view created documents.`,
                ),
            );
    }, [title, revision]);

    const revisionSelect = (
        <select
            className="cursor-pointer"
            value={revision}
            onChange={(event) =>
                navigate(
                    `${revision ? `../page/${title ?? ""}/` : ""}${
                        event.target.value
                    }/`,
                )
            }
        >
            {revisions.map((rev, index) => (
                <option value={rev} key={index}>
                    {new Date(rev * 1000)
                        .toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                        })
                        .replace(",", " -")}
                </option>
            ))}
        </select>
    );

    return (
        <div className="flex min-h-[85vh] max-w-4xl flex-col break-all rounded-2xl border-2 border-black">
            <div
                id="revision-container"
                className="m-5 flex flex-row items-center justify-between"
            >
                <div className="w-90 m-1 h-fit rounded-md border-2 border-black p-2 text-center text-black hover:font-bold">
                    <span>History: </span>
                    {revisionSelect}
                </div>
                <div className="flex flex-col justify-evenly">
                    <Link
                        className="m-1 w-28 cursor-pointer rounded-md border-2 border-blue-700 text-center text-blue-700 hover:font-bold"
                        to={`/create/${title ?? ""}`}
                        key={"change"}
                    >
                        Edit Page
                    </Link>
                    <Link
                        className="w-30 m-1 cursor-pointer rounded-md border-2 border-blue-700 text-center text-blue-700 hover:font-bold"
                        to="/"
                        key={"home"}
                    >
                        Return Home
                    </Link>
                </div>
            </div>
            <div className="m-2 ml-5 mr-5 border-t-2 pt-3 text-center text-2xl font-extrabold underline">
                {title}
            </div>
            <article className="prose m-5 mt-2 w-[80vw] break-keep border-b-2 border-t-2 p-4">
                <ReactMarkdown>{content}</ReactMarkdown>
            </article>
        </div>
    );
};

export const EditPage: FunctionComponent = () => {
    const { title } = useParams();
    const [content, setContent] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [disableEdit, setDisableEdit] = useState(true);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLTextAreaElement>(null);

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
            .catch((error) => console.log(error));

        navigate(`../page/${change}`);
    };

    const handleInputFN = (event: FormEvent) => {
        const input = event.currentTarget as HTMLInputElement;
        const validChars = "abcdefghijklmnopqrstuvwxyz0123456789";
        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lastVal = input.value[input.value.length - 1] ?? "";
        let newVal: string;

        if (!validChars.includes(lastVal)) {
            const shortVal = input.value.substring(0, input.value.length - 1);
            if (upperCase.includes(lastVal))
                newVal = shortVal + lastVal.toLowerCase();
            else newVal = shortVal;
            input.value = newVal;
        }
        setNewTitle(input.value);
        toggleDisableEdit(input.value);
    };

    const toggleDisableEdit = (nt?: string) => {
        nt = nt ?? newTitle;
        setDisableEdit(
            inputRef.current.value === content ||
                (title ? title.length === 0 : true && nt.length === 0),
        );
    };

    return (
        <div className="flex h-[85vh] flex-col items-center">
            <div>
                Editing: {title ?? (newTitle.length ? newTitle : "New Page")}
            </div>
            <textarea
                className="mt-5 h-1/3 w-[80vw] max-w-4xl rounded-md border-2 border-gray-700"
                placeholder="Input page content here..."
                defaultValue={content}
                ref={inputRef}
                onChange={() => toggleDisableEdit()}
            />
            <div className="mt-5 flex h-8 w-3/4 flex-row justify-evenly">
                {title?.length ? null : (
                    <input
                        placeholder="Page Name:"
                        className="w-1/2 rounded-md border-2 border-gray-700"
                        onInput={handleInputFN}
                    />
                )}
                <button
                    className="w-20 cursor-pointer rounded-md border-2 border-green-700 text-green-700 enabled:hover:font-bold disabled:cursor-auto disabled:border-gray-400 disabled:text-gray-400"
                    disabled={disableEdit}
                    onClick={handleEditPage}
                >
                    Create
                </button>
                <button
                    className="w-24 cursor-pointer rounded-md border-2 border-red-700 text-red-700 hover:font-bold"
                    onClick={() => navigate(-1)}
                >
                    Discard
                </button>
            </div>
        </div>
    );
};

const ErrorPage: FunctionComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <div className="mt-5">Invalid route, please redirect.</div>
            <div className="mt-10 flex flex-row justify-evenly">
                <button
                    className="w-24 cursor-pointer rounded-md border-2 border-blue-700 text-blue-700 hover:font-bold"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
                <button
                    className="w-24 cursor-pointer rounded-md border-2 border-blue-700 text-blue-700 hover:font-bold"
                    onClick={() => navigate("..")}
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default Home;
