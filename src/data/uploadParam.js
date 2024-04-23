import { getSearchValue } from "../function";

//User Menu Select List Parameters
export const UploadUserMenuListParams = (data) => {
    return {
        ARG_TYPE: "Q_VALID",
        ARG_EMPID: data.EMPID,
        OUT_CURSOR: "",
    };
};

//User Menu Select List Parameters
export const GateComboListParams = (type, group, value1 = "", value2 = "") => {
    return {
        ARG_TYPE: type,
        ARG_GROUP: group,
        ARG_VALUE: value1,
        ARG_VALUE2: value2,
        OUT_CURSOR: ""
    };
};

//User Menu Select List Parameters
export const GateDataListParams = (type, plant, dateFrom, dateTo, id = "", value = "") => {
    return {
        ARG_TYPE: type,
        ARG_PLANT: plant,
        ARG_DATEF: dateFrom,
        ARG_DATET: dateTo,
        ARG_ID: id,
        ARG_VALUE: value,
        OUT_CURSOR: ""
    };
};

//Update Gate Combo Data
export const UpdateComboListParams = (type, group, code, value) => {
    return {
        ARG_TYPE: type,
        ARG_GROUP: group,
        ARG_CODE: code,
        ARG_VALUE: value
    };
};

//Gate Data
export const GateDataParams = (iDx, plant_cd) => {
    return {
        PLANT_CD        : plant_cd,
        WRK_DATE        : "", 
        VIST_ID         : iDx, 
        VIST_CMPY_CD    : "", 
        VIST_CMPY_NM    : "", 
        VIST_NAME       : "", 
        NEED_DIV_CD     : "", 
        NEED_DIV_NM     : "",
        ID_TYPE_CD      : "", 
        ID_NUM          : "",
        CAR_TYPE_CD     : "",
        CAR_NUM         : "", 
        DEST_CD         : "", 
        DEST_NM         : "", 
        DEST_EMP_NO     : "", 
        DEST_EMP_NM     : "", 
        VIST_CARD_NO    : "", 
        VIST_STS        : "", 
        IN_YMD          : "",
        IN_HMS          : "", 
        REMARK          : "", 
        IMG             : "",
    }
}

//Gate Data
export const GateDataUploadParams = () => {
    return {
        ARG_TYPE                : "",
        ARG_PLANT               : "",
        ARG_VIST_ID             : "", 
        ARG_VIST_CMPY_ID        : "",
        ARG_VIST_NAME           : "",
        ARG_DRV_NAME            : "",
        ARG_NEED_DIV            : "",
        ARG_ID_TYPE_DIV         : "",
        ARG_ID_NUM              : "",
        ARG_CAR_TYPE_DIV        : "",
        ARG_CAR_NUM             : "",
        ARG_DEST_BLD_CD         : "",
        ARG_DEST_EMP_NO         : "",
        ARG_VIST_CARD_NO        : "",
        ARG_VIST_STS            : "",
        ARG_REMARK              : "",
        ARG_CNTR_NO             : "",
        ARG_SEAL_NO             : "",
        ARG_IN_YMD              : "",
        ARG_IN_HMS              : "",
        ARG_UPDATE_USER         : ""
    }
}

export const GateImageUploadParams = (data, blobFile) => {
    let _formData = new FormData();
    let _fileName = data.ID_TYPE_CD + "_" + getSearchValue(data.ID_TYPE_CD, data.ID_NUM, data.CAR_NUM);
    let userID = localStorage.getItem("CONT_USER_ID");
    let userPermiss = localStorage.getItem("CONT_USER_PERMISS");
  
    _formData.append("ARG_TYPE", "Q_SAVE");
    _formData.append("ARG_ID_TYPE_CD", data.ID_TYPE_CD ?? "000");
    _formData.append("ARG_ID_NUM", getSearchValue(data.ID_TYPE_CD, data.ID_NUM, data.CAR_NUM));
    _formData.append("ARG_IMG_NM", _fileName);
    _formData.append("ARG_CREATOR", userID);
    _formData.append("ARG_CREATE_PC", userID + "_" + userPermiss);
    _formData.append("ARG_CREATE_PROGRAM_ID", "GATE_IMAGE_WEB");
    _formData.append(
        "ARG_IMG",
        blobFile,
        _fileName + ".png"
    );
  
    return _formData;
};