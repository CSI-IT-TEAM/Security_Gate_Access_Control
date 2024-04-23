import { useEffect, useState } from "react";
import { Button, TextField, Grid, Typography, InputAdornment } from "@mui/material";
import { Modal } from "rsuite";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DrawIcon from '@mui/icons-material/Draw';

import { isNullOrEmpty, fetchPostData, removeVietnamese, fetchData } from "../../../function";
import { UpdateComboListParams, GateComboListParams } from "../../../data/uploadParam";
import { GateComboUpdateURL, GateComboSelectURL } from "../../../api";
import SelectList from "../../Select/SelectList";
import TextLabel from "../../Text/TextLabel"

const GateAddModal = ({ open, type, handleClose }) => {
    ////// Transldate
    const { t } = useTranslation();

    //// Init Variable
    const [data, setData] = useState("");
    const [group, setGroup] = useState("");
    const [options, setOptions] = useState([]);
    const [valid, setValid] = useState({
        group: true,
        value: true
    });

    useEffect(() => {
        if (open) {
            setData(data => "");
            setGroup(group => "");
            setValid({
                group: true,
                value: true
            });

            if(type === "Q_PIC"){
                handleOption();
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleOption = async() => {
        let _dataList = await fetchData(GateComboSelectURL, GateComboListParams("Q_DEST", ""));
        if(_dataList !== null && _dataList.length > 0){
            let _newArray = [];
            _dataList.forEach(item => {
                _newArray.push({
                    value: item.ITEM_CD,
                    label: item.ITEM_NM
                })
            });

            setOptions(options => _newArray);
        }else{
            setOptions(options => []);
        }
    }

    const handleTitle = () => {
        let _result = "";
        switch (type) {
            case "Q_FTY":
                _result = t('add_fty');
                break;
            case "Q_DIV":
                _result = t('add_div');
                break;
            case "Q_DEST":
                _result = t('add_dest');
                break;
            case "Q_PIC":
                _result = t('add_pic');
                break;
            default:
                break;
        }
        return _result;
    }
    let _title = handleTitle();

    //// Handle Save
    const handleSave = () => {
        if(type === "Q_PIC"){
            if(isNullOrEmpty(data) || isNullOrEmpty(group)){
                setValid(valid => {
                    return {
                        group: !isNullOrEmpty(group),
                        value: !isNullOrEmpty(data)
                    }
                });
                return;
            }
        }else{
            if(isNullOrEmpty(data)){
                setValid(valid => {
                    return {
                        group: true,
                        value: !isNullOrEmpty(data)
                    }
                });
                return;
            }
        }
        
        setValid({
            group: true,
            value: true
        });

        Swal.fire({
            title: t('title_confirm'),
            position: "center",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "seagreen",
            cancelButtonColor: "#dc3741",
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.value) {
                Swal.fire({
                    title: "Please wait!",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                let _updateParams = UpdateComboListParams(type, group, "", removeVietnamese(data));
                let _updateData = await fetchPostData(GateComboUpdateURL, _updateParams);

                if (_updateData) {
                    Swal.close();
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: t("title_reg_success"),
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        handleClose();
                    });
                }
                else {
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        position: "center",
                        title: t("title_reg_fail"),
                        text: t("text_please_check_again"),
                    });
                }
            }
        });
    }

    //// Handle Input Data
    const handleChange = (type, value) => {
        setGroup(group => value);
        setValid(valid => {
            return {
                group: true,
                value: !isNullOrEmpty(data)
            }
        });
    }

    return (
        <Modal backdrop="static" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title style={{ fontSize: "24px", fontWeight: 600, textTransform: "capitalize", color: "#072d7a", fontFamily: "Calibri,Inconsolata,Roboto,Open Sans,sans-serif" }}>{_title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid container spacing={1}>
                    {type === "Q_PIC" &&
                        <Grid item xs={12}>
                            <TextLabel title={t('dest')} />
                            <SelectList
                                name={"DEST_CD"}
                                options={options}
                                value={group ? options.filter(item => item.value === group) : ""}
                                handleChange={handleChange}
                            />
                            {!valid.group &&
                                <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                            }
                        </Grid>
                    }
                    <Grid item xs={12}>
                        {type === "Q_PIC" && <TextLabel title={t('pic_nm')} />}
                        <TextField
                            inputProps={{ inputMode: 'text' }}
                            value={data}
                            sx={{ background: "#f8f6f7", marginTop: "1px" }}
                            onChange={(event) => {
                                setData(data => event.target.value);
                                if(type === "Q_PIC"){
                                    setValid(valid => {
                                        return {
                                            group: !isNullOrEmpty(group),
                                            value: !isNullOrEmpty(data)
                                        }
                                    });
                                }else{
                                    setValid(valid => {
                                        return {
                                            group: true,
                                            value: !isNullOrEmpty(data)
                                        }
                                    });
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <DrawIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />
                                    </InputAdornment>
                                )
                            }}
                            className="b-input bg-white"
                            fullWidth
                            placeholder={t('plholder_type')}
                        />
                        {!valid.value &&
                            <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                        }
                    </Grid>
                </Grid>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSave} appearance="primary" sx={{ padding: "5px 15px", background: "seagreen", color: "#fff", fontWeight: 600, marginRight: "5px", textTransform: "capitalize", "&:hover": { background: "green" } }}>
                    {t('save')}
                </Button>
                <Button onClick={handleClose} appearance="subtle" sx={{ padding: "5px 15px", background: "#d32f2f", color: "#fff", fontWeight: 600, textTransform: "capitalize", "&:hover": { background: "red" } }}>
                    {t('swal_cancel')}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default GateAddModal;