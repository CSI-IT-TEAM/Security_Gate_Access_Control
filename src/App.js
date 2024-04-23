import React, { useState, useEffect } from "react";
import {
    Route,
    Routes,
    BrowserRouter
} from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./components/Header/Header";
import Homepage from "./pages/Homepage";
import ErrorPage from "./pages/404";

import 'rsuite/dist/rsuite.min.css';

const width = window.innerWidth;

function App() {
    /////Init Variable
    const [open, setOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(true);

    const handleOpen = () => {
        setOpen((open) => !open);
    };

    useEffect(() => {
        if (width > 1280 || width <= 1024) {
            setOpen((open) => false);
        } else {
            setOpen((open) => true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);

    return (
        <>
            <BrowserRouter>
                <Header open={open} handleOpen={handleOpen} />
                <Box
                    className={
                        isAuth
                            ? open
                                ? "s-layout s-layout--active"
                                : "s-layout"
                            : null
                    }
                >
                    <Routes>
                        <Route path="/404" element={<ErrorPage />} />
                        <Route path="/" element={<Homepage />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </Box>
                <Box
                    onClick={handleOpen}
                    className={
                    open
                        ? "s-overlay-header s-overlay-header--active"
                        : "s-overlay-header"
                    }
                ></Box>
            </BrowserRouter>
        </>
    );
}

export default App;