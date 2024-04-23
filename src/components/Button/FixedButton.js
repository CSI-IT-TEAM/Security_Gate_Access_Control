import {
    Button,
} from "@mui/material";

const FixedButton = ({ title, icon, handleClick, styles }) => {
    return (
        <>
            <Button
                fullWidth
                endIcon={icon}
                color="success"
                variant="contained"
                size="large"
                sx={[{
                    height: 40,
                    maxWidth: 180,
                    textTransform: "none",
                    fontWeight: '600',
                    fontSize: '16px',
                    boxShadow: 'none',
                }, styles]}
                onClick={handleClick}
            >
                {title}
            </Button>
        </>
    )
}

export default FixedButton;