const config = () => {
    const rewrites = () => {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:5003/:path*",
            },
            {
                source: "/:any*",
                destination: "/",
            },
        ];
    };
    return {
        rewrites,
    };
};

export default config;
