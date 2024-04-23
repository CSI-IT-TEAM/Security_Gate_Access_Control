import { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import PersonIcon from '@mui/icons-material/Person';
import NoteIcon from '@mui/icons-material/Note';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import BusinessIcon from '@mui/icons-material/Business';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StyleIcon from '@mui/icons-material/Style';
import DnsIcon from '@mui/icons-material/Dns';
import BadgeIcon from '@mui/icons-material/Badge';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CreateIcon from "@mui/icons-material/Create";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import userThumb from "../../assets/images/user.png";
import GateModal from "../../components/Modal/GateModal/GateModal";
import GateAddModal from "../../components/Modal/GateAddModal/GateAddModal";
import TextInput from "../../components/Text/TextInput";
import FixedButton from "../../components/Button/FixedButton";
import DotButton from "../../components/Button/DotButton";
import TextLabel from "../../components/Text/TextLabel";
import SelectList from "../../components/Select/SelectList";
import HomeTable from "./HomeTable";

import { GateComboSelectURL, GateDataSelectURL, GateDataUpdateURL, GateImageSelectURL, GateImageUpdateURL } from "../../api";
import { fetchData, isNullOrEmpty, fetchPostData, fetchPostFormData, convertToBlob, getSearchValue, getURLImageFormat } from "../../function";
import { GateComboListParams, GateDataParams, GateDataListParams, GateDataUploadParams, GateImageUploadParams } from "../../data/uploadParam";
import { GateSaveValid } from "../../data/validateParams";

const Homepage = () => {
    //// Init Variable
    const [vehicleOption, setVehicleOption] = useState([]);
    const [idOption, setIdOption] = useState([]);
    const [statusOption, setStatusOption] = useState([]);
    const [plantOption, setPlantOption] = useState([]);
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [typeTake, setTypeTake] = useState("");
    const [saveValid, setSaveValid] = useState(GateSaveValid)

    //// Select Modal
    const [type, setType] = useState("");
    const [selectVal, setSelectVal] = useState("");
    const deleteListRef = useRef([]);

    const [thumb, setThumb] = useState(userThumb);
    const [openSelect, setOpenSelect] = useState(false);
    const [openReg, setOpenReg] = useState(false);

    ////// Transldate
    const { t } = useTranslation();

    //// Capture Image
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleOpenModal = (code, value) => {
        setType(type => code);
        setSelectVal(selectVal => value);
        setOpenSelect(openSelect => true);
    }

    const handleCloseModal = () => {
        setOpenSelect(openSelect => false);
    }

    const handleOpenReg = () => {
        setOpenSelect(openSelect => false);
        setOpenReg(openReg => true);
    }

    const handleCloseReg = () => {
        setOpenSelect(openSelect => true);
        setOpenReg(openReg => false);
    }

    useEffect(() => {
        handleDefault();
        handleNew();

        // Function to start the video stream
        const startVideoStream = async () => {
            try {
                // Request access to the camera
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                // If the video reference exists, assign the stream to its source
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing the camera:', error);
            }
        };

        // Start the video stream when the component mounts
        startVideoStream();

        // Cleanup function to stop the video stream when the component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                // Stop each track in the stream
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    // Function to capture an image from the camera stream
    const handleCaptureImage = () => {
        if (videoRef.current && canvasRef.current) {
            // Get the 2D context of the canvas
            const context = canvasRef.current.getContext('2d');
            // Draw the current frame from the video element onto the canvas
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            // Convert the canvas content to a data URL (image)
            const imageDataURL = canvasRef.current.toDataURL('image/png');

            // Set the captured image as state
            setThumb(thumb => imageDataURL);
        }
    };

    //// Handle Default Event
    const handleDefault = async() => {
        let _vehicleList = await fetchData(GateComboSelectURL, GateComboListParams("Q", "790"));
        if(_vehicleList !== null && _vehicleList.length > 0){
            setVehicleOption(vehicleOption => _vehicleList);
        }else{
            setVehicleOption(vehicleOption => []);
        }

        let _idList = await fetchData(GateComboSelectURL, GateComboListParams("Q", "791"));
        if(_idList !== null && _idList.length > 0){
            setIdOption(idOption => _idList);
        }else{
            setIdOption(idOption => []);
        }

        let _statusList = await fetchData(GateComboSelectURL, GateComboListParams("Q", "793"));
        if(_statusList !== null && _statusList.length > 0){
            setStatusOption(statusOption => _statusList);
        }else{
            setStatusOption(statusOption => []);
        }

        let _plantList = await fetchData(GateComboSelectURL, GateComboListParams("Q_PLANT", ""));
        if(_plantList !== null && _plantList.length > 0){
            setPlantOption(plantOption => _plantList);
        }else{
            setPlantOption(plantOption => []);
        }
    }

    const handleSetDelete = (value) => {
        deleteListRef.current = value;
    }

    //// Handle New 
    const handleNew = async() => {
        let _visitID = await fetchData(GateComboSelectURL, GateComboListParams("Q_VISIT_ID", ""));
        if(_visitID !== null && _visitID.length > 0){
            setData(data => GateDataParams(_visitID[0].ITEM_CD, localStorage.getItem("CONT_USER_PLANT")));
        }else{
            setData(data => GateDataParams(""));
        }
        setThumb(thumb => userThumb);
        setTypeTake(typeTake => "");
        setCount(count => count + 1);
        setSaveValid(saveValid => GateSaveValid);
        deleteListRef.current = [];
    }

    //// Handle Save
    const handleSave = async() => {
        setSaveValid(saveValid => {
            return {
                ID_TYPE_CD: !isNullOrEmpty(data.ID_TYPE_CD),
                ID_NUM: !isNullOrEmpty(data.ID_NUM),
                CAR_NUM: !isNullOrEmpty(data.CAR_NUM),
                VIST_STS: !isNullOrEmpty(data.VIST_STS)
            }
        })

        if(isNullOrEmpty(data.ID_TYPE_CD) || isNullOrEmpty(data.ID_NUM) || isNullOrEmpty(data.CAR_NUM) || isNullOrEmpty(data.VIST_STS)){
            return;
        }

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
                let userID = localStorage.getItem("CONT_USER_ID");

                let uploadConfig = GateDataUploadParams();
                uploadConfig.ARG_TYPE = "Q_SAVE";
                uploadConfig.ARG_PLANT = data.PLANT_CD;
                uploadConfig.ARG_VIST_ID = data.VIST_ID;
                uploadConfig.ARG_VIST_CMPY_ID = data.VIST_CMPY_CD;
                uploadConfig.ARG_VIST_NAME    = data.VIST_NAME;
                uploadConfig.ARG_DRV_NAME     = "";
                uploadConfig.ARG_NEED_DIV     = data.NEED_DIV_CD;
                uploadConfig.ARG_ID_TYPE_DIV  = data.ID_TYPE_CD;
                uploadConfig.ARG_ID_NUM       = data.ID_NUM;
                uploadConfig.ARG_CAR_TYPE_DIV = data.CAR_TYPE_CD;
                uploadConfig.ARG_CAR_NUM      = data.CAR_NUM;
                uploadConfig.ARG_DEST_BLD_CD  = data.DEST_CD;
                uploadConfig.ARG_DEST_EMP_NO  = data.DEST_EMP_NO;
                uploadConfig.ARG_VIST_CARD_NO = data.VIST_CARD_NO;
                uploadConfig.ARG_VIST_STS     = data.VIST_STS;
                uploadConfig.ARG_REMARK       = data.REMARK;
                uploadConfig.ARG_CNTR_NO      = "";
                uploadConfig.ARG_SEAL_NO      = "";
                uploadConfig.ARG_IN_YMD       = data.IN_YMD ?? "";
                uploadConfig.ARG_IN_HMS       = data.IN_HMS ?? "";
                uploadConfig.ARG_UPDATE_USER  = userID;
        
                let _result = await fetchPostData(GateDataUpdateURL, uploadConfig);
                if (_result) {
                    ////Upload User Picture From Camera
                    if(isNullOrEmpty(typeTake)){
                        if (videoRef.current && canvasRef.current) {
                            // Get the 2D context of the canvas
                            const context = canvasRef.current.getContext('2d');
                            // Draw the current frame from the video element onto the canvas
                            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                
                            // Convert the canvas content to a data URL (image)
                            const imageDataURL = canvasRef.current.toDataURL('image/png');
                
                            // Set the captured image as state
                            let blobFile = await convertToBlob(imageDataURL);
                            let _uploadConfig = GateImageUploadParams(data, blobFile);

                            let _result = await fetchPostFormData(
                                GateImageUpdateURL,
                                _uploadConfig
                            );

                            if(_result){
                                Swal.close();
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: t("title_reg_success"),
                                    showConfirmButton: false,
                                    timer: 1500,
                                }).then(() => {
                                    setThumb(thumb => imageDataURL);
                                    setTypeTake(typeTake => "");
                                    setCount(count => count + 1);
                                    deleteListRef.current = [];
                                });
                            }else{
                                Swal.close();
                                Swal.fire({
                                    icon: "error",
                                    position: "center",
                                    title: t("swal_upload_img_failed"),
                                    text: t("text_please_check_again"),
                                    timer: 1500,
                                });
                            }
                        }
                    }
                    else{
                        if(thumb.includes("data:image")){
                            let blobFile = await convertToBlob(thumb);
                            let _uploadConfig = GateImageUploadParams(data, blobFile);

                            let _result = await fetchPostFormData(
                                GateImageUpdateURL,
                                _uploadConfig
                            );

                            if(_result){
                                Swal.close();
                                Swal.fire({
                                    position: "center",
                                    icon: "success",
                                    title: t("title_reg_success"),
                                    showConfirmButton: false,
                                    timer: 1500,
                                }).then(() => {
                                    setTypeTake(typeTake => "");
                                    setCount(count => count + 1);
                                    deleteListRef.current = [];
                                });
                            }else{
                                Swal.close();
                                Swal.fire({
                                    icon: "error",
                                    position: "center",
                                    title: t("swal_upload_img_failed"),
                                    text: t("text_please_check_again"),
                                    timer: 1500,
                                });
                            }
                        }else{
                            Swal.close();
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: t("title_reg_success"),
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(() => {
                                setTypeTake(typeTake => "");
                                setCount(count => count + 1);
                                deleteListRef.current = [];
                            });
                        }
                    }
                }else {
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        position: "center",
                        title: t("swal_submit"),
                        text: t("text_please_check_again"),
                        timer: 1500,
                    });
                }
            }
        });
    }

    ////////Button Upload
    async function getDelete() {
        let _count = 0;

        for (let iCount = 0; iCount < deleteListRef.current.length; iCount++) {
            try {
                let uploadConfig = GateDataUploadParams();
                uploadConfig.ARG_TYPE = "Q_DEL";
                uploadConfig.ARG_PLANT = data.PLANT_CD;
                uploadConfig.ARG_VIST_ID = deleteListRef.current[iCount];

                let _result = await fetchPostData(GateDataUpdateURL, uploadConfig);
                if (_result) {
                    _count++;
                }
            }
            catch {
                break;
            }
        }
        return _count === deleteListRef.current.length ? true : false;
    };

    //// Handle Delete
    const handleDelete = () => {
        if(deleteListRef.current.length > 0){
            Swal.fire({
                title: t('title_confirm'),
                text: t("swal_delete_warning"),
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

                    getDelete().then(async (res) => {
                        if (res) {
                            Swal.close();
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: t("title_del_success"),
                                showConfirmButton: false,
                                timer: 1500,
                            }).then(() => {
                                handleNew();
                            });
                        }
                        else {
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                position: "center",
                                title: t("swal_delete_fail"),
                                text: t("text_please_check_again"),
                                timer: 1500,
                            });
                        }
                    });
                }
            });
        }else{
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("swal_delete_fail"),
                text: t("swal_no_data"),
            });
        }
    }

    //// Handle Confirm Select Data From Modal
    const handleConfirm = (type, selectData) => {
        let code = selectData.ITEM_CD;
        let value = selectData.ITEM_NM;

        switch(type){
            case "Q_DIV":
                setData(data => {
                    return {
                        ...data,
                        NEED_DIV_CD: code,
                        NEED_DIV_NM: value
                    }
                })
                break;
            case "Q_FTY":
                setData(data => {
                    return {
                        ...data,
                        VIST_CMPY_CD: code,
                        VIST_CMPY_NM: value
                    }
                })
                break;
            case "Q_DEST":
                setData(data => {
                    return {
                        ...data,
                        DEST_CD: code,
                        DEST_NM: value
                    }
                })
                break;
            case "Q_PIC":
                setData(data => {
                    return {
                        ...data,
                        DEST_EMP_NO: code,
                        DEST_EMP_NM: value
                    }
                })
                break;
            default:
                break;
        }
    }

    //// Handle Input Data
    const handleChange = (type, value) => {
        setData(data => {
            return {
                ...data,
                [type]: value,
            }
        })
    }

    //// Handle Search
    const handleSearch = async(selectID = "") => {
        if(isNullOrEmpty(selectID) && (isNullOrEmpty(data.ID_TYPE_CD) || isNullOrEmpty(data.ID_NUM))){
            return;
        }
        Swal.fire({
            title: "Please wait!",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        let _searchType = "";
        let _searchData = [];

        if(isNullOrEmpty(selectID)){
            switch(data.ID_TYPE_CD){
                case "001":
                case "003":
                case "004":
                    _searchType = "Q_ID";
                    break;
                case "002":
                    _searchType = "Q_CAR";
                    break;
                default:
                    break;
            }
            _searchData = await fetchData(GateDataSelectURL, GateDataListParams(_searchType, data.PLANT_CD, "", "", data.ID_TYPE_CD, data.ID_NUM));
        }else{
            _searchType = "Q_VISIT_ID";
            _searchData = await fetchData(GateDataSelectURL, GateDataListParams(_searchType, data.PLANT_CD, "", "", "", selectID));
        }

        let _visitID = await fetchData(GateComboSelectURL, GateComboListParams("Q_VISIT_ID", ""));
    
        if(_searchData !== null && _searchData.length > 0){
            setTypeTake(typeTake => "camera");
            let _imgData = await fetchData(GateImageSelectURL, {
                ARG_TYPE: "Q",
                ARG_ID_TYPE_CD: _searchData[0].ID_TYPE_DIV,
                ARG_ID_NUM: getSearchValue(_searchData[0].ID_TYPE_DIV, _searchData[0].ID_NUM, _searchData[0].CAR_NUM),
                OUT_CURSOR: "",
            });

            if(_imgData !== null && _imgData.length > 0){
                setThumb(thumb => getURLImageFormat(_imgData[0].PHOTO));
            }else{
                if(isNullOrEmpty(selectID)){
                    handleCaptureImage();
                }else{
                    setThumb(thumb => userThumb);
                }
            }

            setData(data => {
                return {
                    ...data,
                    VIST_ID         : isNullOrEmpty(selectID) ? _visitID[0].ITEM_CD : _searchData[0].VIST_ID,
                    VIST_CMPY_CD    : _searchData[0].VIST_CMPY_ID, 
                    VIST_CMPY_NM    : _searchData[0].VIST_CMPY_NM, 
                    VIST_NAME       : _searchData[0].VIST_NM, 
                    NEED_DIV_CD     : _searchData[0].NEED_DIV_CD, 
                    NEED_DIV_NM     : _searchData[0].NEED_DIV_NM,
                    ID_TYPE_CD      : _searchData[0].ID_TYPE_DIV, 
                    ID_NUM          : _searchData[0].ID_NUM,
                    CAR_TYPE_CD     : _searchData[0].CAR_TYPE_DIV ?? "",
                    CAR_NUM         : _searchData[0].CAR_NUM, 
                    DEST_CD         : _searchData[0].DEST_CD, 
                    DEST_NM         : _searchData[0].DEST_NM, 
                    DEST_EMP_NO     : _searchData[0].EMP_NO, 
                    DEST_EMP_NM     : _searchData[0].EMP_NAME, 
                    VIST_CARD_NO    : _searchData[0].VIST_CARD_NO, 
                    VIST_STS        : _searchData[0].VIST_STS, 
                    IN_YMD          : _searchData[0].IN_YMD ?? "",
                    IN_HMS          : _searchData[0].IN_HMS ?? "", 
                    REMARK          : _searchData[0].REMARK, 
                    IMG             : "",
                }
            });
            Swal.close();
        }else{
            Swal.close();
            Swal.fire({
                icon: "error",
                position: "center",
                title: t("title_something_wrong"),
                text: t("not-found"),
            });
        }
    }

    return (
        <>
            <Container
                maxWidth={false}
                sx={{
                    marginTop: "15px",
                    width: "100%",
                    display: "flex",
                }}
            >
                <Box style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}>
                    <video ref={videoRef} autoPlay style={{ display: "block", position: "absolute", opacity: 0, width: '400px', height: 'auto' }} />
                    <canvas ref={canvasRef} style={{ display: "none" }} width={400} height={300} />
                    <Box style={{ position: 'relative', width: "100%" }}>
                        <Typography variant="h5" className="s-title">
                            {t('title_gate_secure')}
                        </Typography>
                        <Box sx={{ position: 'absolute', top: 5, right: 0, }}>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75}>
                                <FixedButton
                                    title={t('new')}
                                    icon={<CreateIcon />}
                                    handleClick={handleNew}
                                />
                                <FixedButton
                                    title={t('save')}
                                    icon={<SaveIcon />}
                                    handleClick={handleSave}
                                    styles={{
                                        color: "#004299",
                                        background: "rgb(180, 196, 228)",
                                        "&.MuiButtonBase-root:hover": {
                                            background: "#b4c4e4"
                                        }
                                    }}
                                />
                                <FixedButton
                                    title={t('delete')}
                                    icon={<DeleteIcon />}
                                    handleClick={handleDelete}
                                    styles={{
                                        color: "#d32f2f",
                                        background: "hsl(0 65% 95% / 1)",
                                        "&.MuiButtonBase-root:hover": {
                                            background: "hsl(0 65% 95% / 1)"
                                        }
                                    }}
                                />
                            </Stack>
                        </Box>
                    </Box>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={8} md={8} lg={9}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={6} lg={2.5} xl={2}>
                                    <TextLabel title={t('fty')} />
                                    <SelectList
                                        name={"PLANT_CD"}
                                        options={plantOption}
                                        value={data?.PLANT_CD ? plantOption.filter(item => item.value === data?.PLANT_CD) : ""}
                                        handleChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={2.5} xl={2.5}>
                                    <TextLabel title={t('visit_id')} />
                                    <TextInput
                                        value={data?.VIST_ID}
                                        icon={<BadgeIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={"Type Visitor ID"}
                                        classList={"b-input"}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={3} xl={3.5}>
                                    <Stack direction="row" alignItems="normal" justifyContent="space-between">
                                        <TextLabel title={t('need_div')} />
                                        <DotButton handleClick={() => handleOpenModal("Q_DIV", { ITEM_CD: data?.NEED_DIV_CD, ITEM_NM: data?.NEED_DIV_NM })} />
                                    </Stack>
                                    <TextInput
                                        value={data?.NEED_DIV_NM}
                                        icon={<DnsIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={t('plholder_div')}
                                        classList={"b-input"}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <Stack direction="row" alignItems="normal" justifyContent="space-between">
                                        <TextLabel title={t('company')}/>
                                        <DotButton handleClick={() => handleOpenModal("Q_FTY", { ITEM_CD: data?.VIST_CMPY_CD, ITEM_NM: data?.VIST_CMPY_NM })} />
                                    </Stack>
                                    <TextInput
                                        value={data?.VIST_CMPY_NM}
                                        icon={<BusinessIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={t('plholder_company')}
                                        classList={"b-input"}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={5} xl={4.5}>
                                    <TextLabel title={t('visit_nm')} />
                                    <TextInput
                                        value={data?.VIST_NAME}
                                        name="VIST_NAME"
                                        icon={<PersonIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={t('plholder_visit_nm')}
                                        classList={"b-input bg-white"}
                                        handleChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={3} xl={3.5}>
                                    <Stack direction="row" alignItems="normal" justifyContent="space-between">
                                        <TextLabel title={t('dest')} />
                                        <DotButton handleClick={() => handleOpenModal("Q_DEST", { ITEM_CD: data?.DEST_CD, ITEM_NM: data?.DEST_NM })} />
                                    </Stack>
                                    <TextInput
                                        value={data?.DEST_NM}
                                        icon={<LocationOnIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={t('plholder_dest')}
                                        classList={"b-input"}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={4}>
                                    <Stack direction="row" alignItems="normal" justifyContent="space-between">
                                        <TextLabel title={t('pic')} />
                                        <DotButton handleClick={() => handleOpenModal("Q_PIC", { ITEM_CD: data?.DEST_EMP_NO, ITEM_NM: data?.DEST_EMP_NM })} />
                                    </Stack>
                                    <TextInput
                                        value={data?.DEST_EMP_NM}
                                        icon={<SupervisorAccountIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={t('plholder_pic')}
                                        classList={"b-input"}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={2.5} xl={2}>
                                    <TextLabel title={t('visit_card')} important={true} />
                                    <TextInput
                                        value={data?.VIST_CARD_NO}
                                        name="VIST_CARD_NO"
                                        icon={<StyleIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={t('plholder_card')}
                                        classList={"b-input bg-white"}
                                        handleChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={2.5} xl={2.5}>
                                    <TextLabel title={t('visit_sts')} important={true} />
                                    <SelectList
                                        name={"VIST_STS"}
                                        options={statusOption}
                                        value={data?.VIST_STS ? statusOption.filter(item => item.value === data?.VIST_STS) : ""}
                                        handleChange={handleChange}
                                    />
                                    {!saveValid.VIST_STS &&
                                        <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                                    }
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={7} xl={7.5}>
                                    <TextLabel title={t('remark')} />
                                    <TextInput
                                        value={data?.REMARK}
                                        name="REMARK"
                                        icon={<NoteIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                        placeholder={t('plholder_remark')}
                                        classList={"b-input bg-white"}
                                        handleChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={5.25}>
                                    <TextLabel title={t('id_num')} important={true} />
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <SelectList
                                                name={"ID_TYPE_CD"}
                                                options={idOption}
                                                value={data?.ID_TYPE_CD ? idOption.filter(item => item.value === data?.ID_TYPE_CD) : ""}
                                                handleChange={handleChange}
                                            />
                                            {!saveValid.ID_TYPE_CD &&
                                                <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextInput
                                                value={data?.ID_NUM}
                                                name="ID_NUM"
                                                icon={<RecentActorsIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                                placeholder={t('plholder_data')}
                                                classList={"b-input bg-white"}
                                                handleChange={handleChange}
                                            />
                                            {!saveValid.ID_NUM &&
                                                <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={5.25}>
                                    <TextLabel title={t('vehicle_type')} />
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <SelectList
                                                name={"CAR_TYPE_CD"}
                                                options={vehicleOption}
                                                value={data?.CAR_TYPE_CD ? vehicleOption.filter(item => item.value === data?.CAR_TYPE_CD) : ""}
                                                handleChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextInput
                                                value={data?.CAR_NUM}
                                                name="CAR_NUM"
                                                icon={<LocalShippingIcon sx={{ color: '#d5d5d5', fontSize: '23px' }} />}
                                                placeholder={t('plholder_license')}
                                                classList={"b-input bg-white"}
                                                handleChange={handleChange}
                                            />
                                            {!saveValid.CAR_NUM &&
                                                <Typography className='b-validate'><HighlightOffIcon sx={{ width: '17px', height: '17px' }} />{t('frm_required')}</Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={1.5}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        endIcon={<SearchOutlinedIcon />}
                                        className="btn-search"
                                        onClick={() => handleSearch()}
                                    >
                                        {t('search')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={3}>
                            <Box style={{ position: "relative" }}>
                                <Box className={thumb === userThumb ? "s-thumb s-thumb--default" : "s-thumb"}>
                                    <img src={thumb}
                                        alt="Iamge Avatar"
                                        loading="lazy" />
                                </Box>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        height: 65,
                                        width: 65,
                                        minWidth: "auto",
                                        boxShadow: 'none',
                                        padding: 0,
                                        background: "#e6e9ee",
                                        color: "#417d9d",
                                        borderRadius: "50%",
                                        left: "50%",
                                        bottom: "-30px",
                                        position: "absolute",
                                        transform: "translateX(-50%)",
                                        "&:hover": {
                                            background: "#417d9d",
                                            color: "#fff"
                                        }
                                    }}
                                    onClick={handleCaptureImage}
                                >
                                    <CameraAltOutlinedIcon sx={{ fontSize: 34 }} />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <HomeTable plant={data.PLANT_CD} handleSearch={handleSearch} handleSet={handleSetDelete} count={count}/>
                </Box>
            </Container>
            <GateModal open={openSelect} type={type} data={selectVal} handleData={handleConfirm} handleClose={handleCloseModal} handleAdd={handleOpenReg} />
            <GateAddModal open={openReg} type={type} handleClose={handleCloseReg} />
        </>
    )
}

export default Homepage;