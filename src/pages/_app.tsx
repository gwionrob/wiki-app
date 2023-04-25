import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

const MyApp: AppType = ({ Component, pageProps }) => {
    const [render, setRender] = useState(false);
    useEffect(() => setRender(true), []);
    return render ? (
        <Router>
            <Component {...pageProps} />
        </Router>
    ) : null;
};

export default MyApp;
