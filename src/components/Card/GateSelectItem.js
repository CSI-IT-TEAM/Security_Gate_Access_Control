import { Box, Stack } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const GateSelectItem = ({ data, iDx, selectData, handleSelect}) => {
    //////Desktop or Mobile
    const _checked = data.ITEM_CD === selectData.ITEM_CD && data.ITEM_NM === selectData.ITEM_NM;

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" className={iDx%2 === 0 ? "b-card-40" : "b-card-40 b-card-40--selected"} onDoubleClick={() => {handleSelect(data)}}>
            <Stack direction="row" alignItems="center" gap={1} sx={{position: "relative"}}>
                <Box className="b-icon">
                    {_checked ? <CheckCircleIcon sx={{fontSize: 20, color: "seagreen"}} /> : <FiberManualRecordIcon sx={{ fontSize: 10, color: "#cdd7dc" }} />}
                </Box>
                <Box className={_checked ? "b-title b-title--selected" : "b-title"}>{data.ITEM_NM}</Box>
            </Stack>
        </Stack>
    )
}

export default GateSelectItem;