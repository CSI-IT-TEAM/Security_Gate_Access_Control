const baseURL = "https://172.30.10.120/";
//const baseURL = "http://172.30.30.41:3000/";

//R Procedures====================================================================
export const UserMenuListSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.USER_MENU_SELECT";
export const GateComboSelectURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.GATE_COMBO_SELECT";
export const GateDataSelectURL = 
  baseURL + "LMES/PKG_RSM_CONTRACTOR.GATE_DATA_SELECT";
export const GateImageSelectURL = 
  baseURL + "HUBIC/PKG_GATE_SECURITY.GATE_IMG_SELECT";

//S Procedures====================================================================
export const GateComboUpdateURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.GATE_COMBO_SAVE/SAVE";
export const GateDataUpdateURL =
  baseURL + "LMES/PKG_RSM_CONTRACTOR.GATE_DATA_SAVE/SAVE";
export const GateImageUpdateURL = "https://172.30.10.120:10000/RSM_GATE_UPLOAD";