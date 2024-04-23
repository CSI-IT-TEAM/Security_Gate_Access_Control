import { Box, Typography } from "@mui/material";
import SideItem from "./SideItem/SideItem";
import BookIcon from '@mui/icons-material/Book';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';

import "./Sidebar.scss";
import logo from "../../assets/images/logos/logo.jpg";
import { useTranslation } from "react-i18next";

const Sidebar = ({ isOpen, handleOpen, pages }) => {

    //// Handle Navigate
    const handleNavigate = async(path, menuCode) => {
        if (path !== null && path !== "" && path !== undefined) {
            if (menuCode === "00013") {
                window.location.reload();
            }else{
                window.location.replace('http://vjcsms.dskorea.com:3090' + path);
            }
        }
    };

    /////// Loop Title By Time
    const { t } = useTranslation();

    return (
        <>
            <Box className={isOpen ? "s-sidebar is-open" : "s-sidebar"}>
                <Box className="s-sidebar__logo" onClick={() => handleNavigate("/")}>
                    <Box
                        className="s-sidebar__logo-thumb"
                    >
                        <img src={logo} alt="Logo" />
                    </Box>
                    <span>
                        <Typography variant="h1" className="s-sidebar__logo-title">
                            <span>Contractor Safety</span> Management System
                        </Typography>
                    </span>
                </Box>
                <Box className="s-sidebar__menu">
                    <Box className="s-sidebar__menu-item s-sidebar__menu-item--sub">
                        <AutoAwesomeMosaicIcon sx={{ fontSize: 30 }} />
                        <Typography className="s-sidebar__menu-item-title">
                            {t("title_services")}
                        </Typography>
                    </Box>
                    {pages != null &&
                        pages.length > 0 &&
                        pages.map((item, index) => {
                            if(item.CATEGORY_CD === "SERVICE"){
                                return (
                                    <SideItem
                                        key={item.MENU_NAME}
                                        data={item}
                                        handleNavigate={handleNavigate}
                                        isOpen={isOpen}
                                    />
                                );
                            }
                            else{
                                return null;
                            }
                        })}
                    {pages !== null && pages.length > 0 && pages.filter(item => item.CATEGORY_CD === "REPORT").length > 0 &&
                        <Box className="s-sidebar__menu-item s-sidebar__menu-item--sub">
                            <BookIcon sx={{ fontSize: 30 }} />
                            <Typography className="s-sidebar__menu-item-title">
                                {t('report')}
                            </Typography>
                        </Box>
                    }
                    {pages != null &&
                        pages.length > 0 &&
                        pages.map((item, index) => {
                            if(item.CATEGORY_CD === "REPORT"){
                                return (
                                    <SideItem
                                        key={item.MENU_NAME}
                                        data={item}
                                        handleNavigate={handleNavigate}
                                        isOpen={isOpen}
                                    />
                                );
                            }
                            else{
                                return null;
                            }
                        })}
                </Box>
            </Box>
        </>
    );
};

export default Sidebar;