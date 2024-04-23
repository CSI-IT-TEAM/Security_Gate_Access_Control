import {
    Typography,
} from "@mui/material";

const TextLabel = ({ title, important=false }) => {
    return (
        <>
            <Typography
                style={{
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: 3,
                    fontSize: 16,
                }}
            >
                {title}
                {important && 
                    <span style={{
                        color: 'red',
                        fontSize: '12px',
                        marginBottom: '10px',
                        marginLeft: '5px',
                        fontWeight: 'bold'
                    }}>(*)</span>
                }
            </Typography>
        </>
    )
}

export default TextLabel;