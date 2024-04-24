

import { useState, useEffect } from "react";
import {
    Box,
    Stack,
    LinearProgress,
    Typography,
    Divider,
    Chip
} from "@mui/material";
import { DateRangePicker } from "rsuite";
import { useTranslation } from "react-i18next";
import {
    DataGrid,
} from "@mui/x-data-grid";
import Swal from "sweetalert2";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoopIcon from '@mui/icons-material/Loop';

import TextLabel from "../../components/Text/TextLabel";
import { GateComboSelectURL, GateDataSelectURL } from "../../api";
import { fetchData, StringToDate, DateToString, isNullOrEmpty } from "../../function";
import { GateComboListParams, GateDataListParams } from "../../data/uploadParam";
import { CustomToolbar, CustomNoRowsOverlay } from "../../data/tableParam";

const HomeTable = ({ plant, handleSearch, handleSet, count }) => {
    //// Init Variable
    const [date, setDate] = useState([]);
    const [table, setTable] = useState([]);
    const [selectID, setSelectID] = useState("");
    const [selectionModel, setSelectionModel] = useState([]);

    ////// Transldate
    const { t } = useTranslation();

    useEffect(() => {
        handleDefault();
    }, []);

    useEffect(() => {
        if (date != null && date.length > 0 && !isNullOrEmpty(plant)) {
            handleTable();
            setSelectionModel(selectionModel => []);
            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, plant, count]);

    //// Get Row ID
    function getRowId(row) {
        return row.VIST_ID;
    }

    //// Handle Default
    const handleDefault = async () => {
        let _today = await fetchData(GateComboSelectURL, GateComboListParams("Q_DATE", ""));
        if (_today !== null && _today.length > 0) {
            setDate([StringToDate(_today[0].ITEM_CD), StringToDate(_today[0].ITEM_CD)]);
        } else {
            setDate([new Date(), new Date()]);
        }
    }

    //// Get Table Data
    const handleTable = async () => {
        Swal.fire({
            title: "Please wait!",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        
        let _dateFrom = DateToString(date[0]);
        let _dateTo = DateToString(date[1]);

        let _tableList = await fetchData(GateDataSelectURL, GateDataListParams("Q", plant, _dateFrom, _dateTo));
        if (_tableList !== null && _tableList.length > 0) {
            setTable(table => _tableList);
            Swal.close();
        } else {
            setTable(table => []);
            Swal.close();
        }
    }

    //// Handle Row Click
    const handleRowClick = (params) => {
        setSelectID(selectID => params.row.VIST_ID);
        handleSearch(params.row.VIST_ID);
    };

    function getChipProps(params: GridRenderCellParams): ChipProps {
        if (params.value.toUpperCase() === "IN") {
            return {
                icon: <LoopIcon style={{ fill: '#ea712f', fontSize: 22, }} />,
                label: t('sts_in'),
                style: {
                    borderColor: '#ea712f',
                    color: '#ea712f',
                }
            };
        } else {
            return {
                icon: <CheckCircleIcon style={{ fill: '#1b5e20', fontSize: 22, }} />,
                label: t('sts_out'),
                style: {
                    borderColor: '#1b5e20',
                    color: '#1b5e20',
                }
            };
        }
    }

    const handleTranslate = (value) => {
        let _result = "";

        switch(value.toUpperCase()){
            case "TRUCKS":
                _result = t('txt_truck');
                break;
            case "CARS":
                _result = t('txt_car');
                break;
            case "CONTAINERS":
                _result = t('txt_container');
                break;
            case "OTHERS":
                _result = t('txt_other');
                break;
            case "VISITORS - VIP":
                _result = t('txt_visit_vip');
                break;
            case "VISITORS - NORMAL":
                _result = t('txt_visit_normal');
                break;
            case "CONTRACTOR":
                _result = t('txt_contractor');
                break;
            default:
                _result = value;
                break;
        }

        return _result;
    }

    //// Column Config
    const columns = [
        {
            field: "ORD",
            headerName: t('no'),
            width: 20,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "IN_DATE",
            headerName: t('date'),
            width: 100,
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "VIST_CMPY_NM",
            headerName: t('company'),
            width: 120,
            align: "left",
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "VIST_ID",
            headerName: t('visit_id'),
            width: 150,
            align: "center",
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "VISIT_NM",
            headerName: t('visit_nm'),
            width: 220,
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "NEED_DIV_NM",
            headerName: t('need_div'),
            width: 140,
            align: "center",
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
            renderCell: (params) => {
                return <>{handleTranslate(params.value)}</>;
            }
        },
        {
            field: "CAR_TYPE",
            headerName: t('vehicle_type'),
            width: 100,
            editable: false,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
            renderCell: (params) => {
                return <>{handleTranslate(params.value)}</>;
            }
        },
        {
            field: "CAR_NUM",
            headerAlign: "center",
            headerName: t('car_num'),
            // description: "This column has a value getter and is not sortable.",
            sortable: false,
            width: 150,
            align: "center",
            //   valueGetter: (params) =>
            //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
            headerClassName: "super-app-theme--header",
        },
        {
            field: "DEST_NM",
            headerName: t('dest_build'),
            width: 150,
            align: "left",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "ID_NUM",
            headerName: t('id_num'),
            width: 130,
            editable: false,
            align: "left",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "VIST_CARD_NO",
            headerName: t('visit_card'),
            width: 100,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "VIST_STS_NM",
            headerName: t('status'),
            width: 100,
            editable: false,
            align: "center",
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
            renderCell: (params) => {
                return <Chip variant="outlined" {...getChipProps(params)} />;
            }
        },
        {
            field: "IN_DATE_TIME",
            headerName: t('time_in'),
            width: 175,
            align: "center",
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "OUT_DATE_TIME",
            headerName: t('time_out'),
            width: 175,
            align: "center",
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
        {
            field: "REMARK",
            headerName: t('remark'),
            width: 350,
            align: "left",
            editable: false,
            headerAlign: "center",
            headerClassName: "super-app-theme--header",
        },
    ];

    return (
        <>
            <Box className="s-bot">
                <Stack direction="row" justifyContent="space-between" alignItems="end">
                    <Stack direction="row" spacing={1} alignItems="end">
                        <TextLabel title={t('date')} />
                        <DateRangePicker
                            cleanable={false}
                            size="lg"
                            showOneCalendar={true}
                            value={date}
                            onChange={(e) => setDate(date => e)}
                        />
                    </Stack>
                    <Divider textAlign="right" className="b-divide">
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                color: "#3f51b5",
                                fontFamily: '"Calibri", "Inconsolata", "Roboto", "Open Sans", sans-serif',
                                fontSize: 19,
                            }}
                        >
                            {t('tot_guest')}: {table.length}
                        </Typography>
                    </Divider>
                </Stack>
            </Box>
            <DataGrid
                sx={{
                    "& .MuiDataGrid-row:hover": {
                        color: "primary.main",
                        background: "#fffee3",
                    },
                    "& .MuiDataGrid-columnHeaderTitleContainer": {
                        backgroundColor: "#1c366b",
                        color: "white",
                    },
                    "& .MuiDataGrid-columnHeaderTitleContainer .MuiSvgIcon-root": {
                        color: "white",
                    },
                    "& .super-app-theme--header": {
                        backgroundColor: "#1c366b",
                        color: "white",
                    },
                    "& .super-app-theme--text_supervisor": {
                        color: "gold",
                        fontWeight: "600",
                    },
                    "& .MuiDataGrid-cell": {
                        cursor: "pointer",
                    },
                    "& .MuiIconButton-root": {
                        color: "#fff",
                    },
                    "& .MuiTablePagination-actions .MuiIconButton-root": {
                        color: "#333",
                    }
                }}
                getRowId={getRowId}
                rows={table}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(items) => {
                    handleSet(items);
                    setSelectionModel(items);
                }}
                rowSelectionModel={selectionModel}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                        },
                    },
                }}
                getRowClassName={(params) => {
                    return params.row.VIST_ID === selectID ? 's-selected-row' : '';
                }}
                pageSizeOptions={[25, 50, 75, 100]}
                onRowClick={handleRowClick}
                slots={{
                    toolbar: CustomToolbar,
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                    },
                }}
            />
        </>
    )
}

export default HomeTable;