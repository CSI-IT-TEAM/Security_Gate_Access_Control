import { Box, Typography, Popover } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./SideItem.scss";
const width = window.innerWidth;

const SideItem = ({ data, handleNavigate, isOpen }) => {
    /////// Location
    const { t } = useTranslation();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if(width <= 991 || isOpen === false){
            setAnchorEl(null);
        }else{
            setAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Box
                className="s-menu"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Box
                    className={
                        (location.pathname === data.ROUTE && data.MENU_CD === "00013")
                            ? "s-menu-top is-active"
                            : "s-menu-top"
                    }
                    onClick={() => {
                        handleNavigate(data.ROUTE, data.MENU_CD);
                    }}
                >
                    <Box className="s-menu-thumb">
                        <img src={data.IMAGE_URL} alt={data.MENU_NAME} />
                    </Box>
                    <Typography className="s-menu-title">
                        {t(`${data.MENU_DISPLAY_NAME}`)}
                    </Typography>
                </Box>
            </Box>
            <Popover
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                className="s-popover"
            >
                <Typography sx={{ p: 1 }}>{t(`${data.MENU_DISPLAY_NAME}`)}</Typography>
            </Popover>
        </>
    );
};

export default SideItem;