import { useState, useEffect } from "react";
import {
    TextField,
    InputAdornment,
} from "@mui/material";

const TextInput = ({ value, icon, name, placeholder, classList, handleChange, disabled = false, handleKey = null}) => {
    //// Init Variable
    const [data, setData] = useState(value);

    useEffect(() => {
        setData(data => value);
    },[value])

    return (
        <>
            <TextField
                inputProps={{ inputMode: 'text' }}
                value={data}
                sx={{ background: "#f8f6f7" }}
                className={classList}
                fullWidth
                disabled={disabled}
                placeholder={placeholder}
                onChange={(e) => setData(data => e.target.value)}
                onBlur={(e) => handleChange(name, e.target.value)}
                onKeyPress={(e) => handleKey === null ? '' :handleKey(e, data)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {icon}
                        </InputAdornment>
                    ),
                }}
            />
        </>
    )
}

export default TextInput;