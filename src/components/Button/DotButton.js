import {
    Button,
} from "@mui/material";
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

const DotButton = ({ handleClick }) => {
    return (
        <>
            <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                    height: 23,
                    width: 40,
                    minWidth: "auto",
                    textTransform: "none",
                    fontWeight: '600',
                    fontSize: '16px',
                    boxShadow: 'none',
                    padding: 0,
                    background: "#d5d5d5",
                    color: "#404040",
                    borderRadius: "5px",
                    "&:hover": {
                        background: "#b4c4e4",
                        color: "#3f51b5"
                    }
                }}
                onClick={handleClick}
            >
                <MoreHorizOutlinedIcon sx={{ fontSize: 24 }} />
            </Button>
        </>
    )
}

export default DotButton;