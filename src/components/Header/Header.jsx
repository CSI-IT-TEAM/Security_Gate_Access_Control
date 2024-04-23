import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Avatar, IconButton, Stack } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import Select from "react-select";
import i18next from "i18next";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import vnlang_image from "../../assets/images/languages/vn.png";
import enlang_image from "../../assets/images/languages/en.png";
import longhaiAvatar from "../../assets/images/avatar/LONGHAI.png";

import { GateComboSelectURL, UserMenuListSelectURL } from "../../api";
import { fetchData } from "../../function";
import { UploadUserMenuListParams } from "../../data/uploadParam";
import "./Header.scss";

var languages = [
    { value: "vn", label: "Việt Nam", image: vnlang_image,},
    { value: "en", label: "English", image: enlang_image },
];

const Header = ({ open, handleOpen }) => {
    ////Init Variable
    const [userAvatar, setUserAvatar] = useState("");
    const i18_Value =
        i18next.language !== null &&
            i18next.language !== undefined &&
            i18next.language !== ""
            ? i18next.language
            : "en";
    const [lang, setLang] = useState(i18_Value);
    const [pages, setPages] = useState([]);

    //////// Get Image Base-64
    const arrayBufferToBase64 = (buffer) => {
        var base64Flag = "data:image/jpeg;base64,";
        var binary = "";
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => (binary += String.fromCharCode(b)));

        return base64Flag + window.btoa(binary);
    };
    const handleChange = (event) => {
        i18next.changeLanguage(event.value);
        setLang(event.value);
    };

    useEffect(() => {
        handleDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleDefault = async() => {
        // Create a URLSearchParams object using the current URL search
        const params = new URLSearchParams(window.location.search);
        if(params.size > 0){
            localStorage.setItem("CONT_USER_ID", params.get('userID'));
            localStorage.setItem("CONT_USER_PERMISS", params.get('userPermiss'));
            localStorage.setItem("CONT_USER_PLANT", params.get('userPlant'));
        }

        let userID = localStorage.getItem("CONT_USER_ID"); //params.get('userID');
        let userPermiss = localStorage.getItem("CONT_USER_PERMISS"); //params.get('userPermiss');
        let UserAvatar = null;

        // Get the current URL path (excluding query parameters)
        const currentPath = window.location.pathname;

        // Replace the URL with the path only, without query parameters
        window.history.replaceState(null, '', currentPath);

        let _avatarData = await fetchData(GateComboSelectURL, {
            ARG_TYPE: "Q_AVATAR",
            ARG_GROUP:  "",
            ARG_VALUE: userID,
            ARG_VALUE2: "",
            OUT_CURSOR: "",
        });
        if(_avatarData !== null && _avatarData.length > 0){
            UserAvatar = _avatarData[0].PHOTO.data;
        }

        const UserMenuParams = {
            TYPE: "Q",
            EMPID: userID,
        };

        const _result = await fetchData(UserMenuListSelectURL, UploadUserMenuListParams(UserMenuParams));
        if(_result !== null && _result.length > 0){
            setPages(pages => _result);
        }
        else{
            setPages(pages => []);
        }

        if (userPermiss === "SCR") {
            setUserAvatar(longhaiAvatar);
        } else {
            setUserAvatar(arrayBufferToBase64(UserAvatar));
        }
    }

    const handleTest = () => {
        const baseUrl = 'https://www.example.com';

        // Define data to send as query parameters
        const data = {
            userID: "3021040735",
            userPermiss: "ADMIN",
            userPlant: "2110",
        };

        // Construct the URL with query parameters
        const url = new URL(baseUrl);
        Object.entries(data).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        // Open the new website in a new tab
        window.open(url.toString(), '_blank');
    }

    return (
        <>
            <Sidebar isOpen={open} handleOpen={handleOpen} pages={pages} />
            <Box className={open ? "s-header header-active" : "s-header"}>
                <Box className="s-header-menu" onClick={handleOpen}>
                    {open ? (
                        <MenuOpenIcon sx={{ fontSize: 32 }} />
                    ) : (
                        <MenuIcon sx={{ fontSize: 32 }} />
                    )}
                </Box>
                <Box className="s-header-content">
                    <Box className="s-avatar">
                        <Stack spacing={1} direction={"row"} alignItems={"center"}>
                            <Select
                                defaultValue={languages.filter((item) => item.value === lang)}
                                options={languages}
                                isSearchable={false}
                                styles={{
                                    control: (base, { isDisabled, isFocused }) => ({
                                        ...base,
                                        borderRadius: 5,
                                        background: isDisabled ? "#EBEBEB" : "#FFFFFF",
                                        minWidth: "100px",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: 9999,
                                        color: "black",
                                    }),
                                }}
                                formatOptionLabel={(item) => (
                                    <Box alignItems={"center"}>
                                        <Stack
                                            spacing={0.8}
                                            direction={"row"}
                                            alignItems={"center"}
                                        >
                                            <img
                                                style={{
                                                    width: "32px",
                                                    height: "22px",
                                                    boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                                                }}
                                                src={item.image}
                                                alt="languages"
                                            />
                                            <Typography sx={{ fontSize: '17px' }}>{item.label}</Typography>
                                        </Stack>
                                    </Box>
                                )}
                                onChange={handleChange}
                            />
                            <IconButton
                                id="basic-button"
                                sx={{ p: 0 }}
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                            >
                                <Avatar
                                    alt="avatar"
                                    src={userAvatar}
                                    className="s-avatar__thumb"
                                />
                            </IconButton>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default Header;