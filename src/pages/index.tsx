import { Route, Routes } from "react-router-dom";

import App from "@/App";

export const Pages = () => {
    return (
        <div className="max-w-6xl p-5 m-auto">
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </div>
    );
};
