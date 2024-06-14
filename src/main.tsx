import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { BrowserRouter } from "react-router-dom";

import { Pages } from "@/pages";

import { ProvidersRainbowKit } from "./providers-rainbowKit";

import("buffer").then(({ Buffer }) => {
    window.Buffer = Buffer;
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ProvidersRainbowKit>
                <Pages />
            </ProvidersRainbowKit>
        </BrowserRouter>
    </React.StrictMode>
);
