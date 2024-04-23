import { useState, useEffect } from "react";
import { Button, Box, TextField, Grid, InputAdornment } from "@mui/material";
import { Modal } from "rsuite";
import { useTranslation } from "react-i18next";
import { List, AutoSizer } from "react-virtualized";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import GateSelectItem from "../../Card/GateSelectItem";
import { fetchData, isNullOrEmpty } from "../../../function";
import { GateComboListParams } from "../../../data/uploadParam";
import { GateComboSelectURL } from "../../../api";

const GateModal = ({ open, type, data, handleData, handleClose, handleAdd }) => {
    ////// Transldate
    const { t } = useTranslation();

    //// Init Variable
    const [list, setList] = useState([]);
    const [prevList, setPrevList] = useState([]);
    const [search, setSearch] = useState("");
    const [select, setSelect] = useState("");

    const handleTitle = () => {
        let _result = "";
        switch (type) {
            case "Q_FTY":
                _result = t('sel_fty');
                break;
            case "Q_DIV":
                _result = t('sel_div');
                break;
            case "Q_DEST":
                _result = t('sel_dest');
                break;
            case "Q_PIC":
                _result = t('sel_pic');
                break;
            default:
                break;
        }
        return _result;
    }
    let _title = handleTitle();

    //// Fire Default Event
    useEffect(() => {
        if (open) {
            handleDefault();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, type]);

    const handleDefault = async () => {
        let _dataList = await fetchData(GateComboSelectURL, GateComboListParams(type, ""));
        if (_dataList != null && _dataList.length > 0) {
            setList(list => _dataList);
            setPrevList(prevList => _dataList);
        }
        else {
            setList(list => []);
            setPrevList(prevList => []);
        }
        setSelect(select => data);
        setSearch(search => "");
    }

    //// Handle Select Item
    const handleSelect = (code) => {
        setSelect(select => code);
    }

    //////Row Rendered Of React-Virtualized
    const rowRenderer = ({
        index, // Index of row
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        key, // Unique key within array of rendered rows
        parent, // Reference to the parent List (instance)
        style, // Style object to be applied to row (to position it);
    }) => {
        const data = list[index];

        return (
            <Box key={key} style={style} sx={{ margin: '1px', paddingRight: '2px' }}>
                <GateSelectItem data={data} iDx={index} selectData={select} handleSelect={handleSelect} />
            </Box>
        );
    }

    //// Handle List Height
    const handleHeight = () => {
        let _result = 0;
        if (list.length > 7) {
            _result = 7 * 42;
        }
        else {
            _result = list.length * 42;
        }
        return _result;
    }

    //// Handle Filter
    const handleFilter = (value) => {
        setSearch(search => value);
        let _prevData = prevList;

        if (isNullOrEmpty(value)) {
            setList(list => _prevData);
        } else {
            let _filterData = _prevData.filter(item => item.ITEM_NM.includes(value) || item.ITEM_NM.toLowerCase().includes(value.toLowerCase()));
            setList(list => _filterData);
        }
    }

    //// Handle Confirm Data
    const handleConfirm = () => {
        handleData(type, select);
        handleClose();
    }

    return (
        <Modal backdrop="static" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title style={{ fontSize: "25px", fontWeight: 600, textTransform: "capitalize", color: "#072d7a", fontFamily: "Calibri,Inconsolata,Roboto,Open Sans,sans-serif" }}>{_title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={9.5}>
                        <TextField
                            inputProps={{ inputMode: 'text' }}
                            value={search}
                            sx={{ background: "#f8f6f7" }}
                            onChange={(event) => {
                                handleFilter(event.target.value)
                            }}
                            InputProps={{
                                endAdornment: isNullOrEmpty(search) ? (
                                    <InputAdornment position="end">
                                        <SearchIcon
                                            sx={{
                                                cursor: "pointer",
                                            }}
                                        />
                                    </InputAdornment>
                                ) : (
                                    <InputAdornment position="end">
                                        <CloseIcon
                                            sx={{
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilter("")}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            className="b-input bg-gray"
                            fullWidth
                            placeholder={t('quick_search')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2.5}>
                        <Button
                            fullWidth
                            endIcon={<AddIcon />}
                            variant="contained"
                            size="large"
                            sx={{
                                height: 45,
                                textTransform: "none",
                                fontWeight: '600',
                                fontSize: '16px',
                                boxShadow: 'none',
                                color: "#fff",
                                background: "#417d9d",
                            }}
                            onClick={handleAdd}
                        >
                            {t('add')}
                        </Button>
                    </Grid>
                </Grid>
                <Box style={{ marginTop: 5, height: `${handleHeight()}px` }}>
                    {list !== null && list.length > 0 &&
                        <AutoSizer>
                            {({ height, width }) => {
                                return (
                                    <List
                                        height={height}
                                        rowHeight={42}
                                        rowRenderer={rowRenderer}
                                        rowCount={list.length}
                                        width={width}
                                        overscanRowCount={5}
                                    />
                                );
                            }}
                        </AutoSizer>
                    }
                </Box>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleConfirm} appearance="primary" sx={{ padding: "5px 15px", background: "seagreen", color: "#fff", fontWeight: 600, marginRight: "5px", textTransform: "capitalize", "&:hover": { background: "green" } }}>
                    {t('confirm')}
                </Button>
                <Button onClick={handleClose} appearance="subtle" sx={{ padding: "5px 15px", background: "#d32f2f", color: "#fff", fontWeight: 600, textTransform: "capitalize", "&:hover": { background: "red" } }}>
                    {t('swal_cancel')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GateModal;