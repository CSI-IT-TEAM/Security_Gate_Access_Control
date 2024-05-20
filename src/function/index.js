//////Cancel Fetch API After Timeout
const Timeout = (time) => {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), time * 1000);
    return controller;
};

/////Fetch Data
export const fetchData = async (url, dataConfig) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataConfig),
            signal: Timeout(5).signal,
        });

        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

/////Fetch Post Data
export const fetchPostData = async (url, dataConfig) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataConfig),
        });

        return response.status === 200 ? true : false;
    } catch {
        return false;
    }
};

/////Fetch Post Form Data
export const fetchPostFormData = async (url, dataConfig) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            body: dataConfig,
        });

        return response.status === 200 ? true : false;
    } catch {
        return false;
    }
};

/////Check Is null Of Empty
export const isNullOrEmpty = (value) => {
    if (value === null || value === "" || value === undefined) {
        return true;
    } else {
        return false;
    }
};

//// Remove Vietnamese
export const removeVietnamese = (str, c = "-") => {
    try {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
  
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      return str;
    } catch {
      return str;
    }
  };

//// Convert string to date
export const StringToDate = (inputDate) => {
    const year = inputDate.substring(0, 4);
    const month = inputDate.substring(4, 6);
    const day = inputDate.substring(6, 8);

    // Create a new Date object
    const date = new Date(year, month - 1, day); // month - 1 because months are zero-based in JavaScript Date object

    return date;
};

//// Convert date to string
export const DateToString = (value) => {
    let date = value;
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let ymd = date.getFullYear().toString() + ((month > 9 ? '' : '0') + month).toString() + ((day > 9 ? '' : '0') + day).toString();

    return ymd;
}

export const convertToBlob = (dataUrl) => {
    // Check if data URL is provided
    if (dataUrl) {
        // Split the data URL to get the MIME type and base64 data
        const [header, base64Data] = dataUrl.split(',');

        // Decode the base64 data
        const binaryData = atob(base64Data);

        // Create an array of 8-bit unsigned integers from the binary data
        const arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            arrayBuffer[i] = binaryData.charCodeAt(i);
        }

        // Extract the MIME type from the data URL
        const mimeType = header.match(/data:(.*);base64/)[1];

        // Create a Blob from the array buffer and MIME type
        const blob = new Blob([arrayBuffer], { type: mimeType });

        // Set the Blob in state
        return blob;
    } else {
        console.log('No data URL provided.');
    }
};

//// Search Value
export const getSearchValue = (type, value1, value2) => {
    let  _value = "";

    switch(type){
        case "002":
            _value = value2;
            break;
        default:
            _value = value1;
            break;
    }

    return _value;
}

export const getURLImageFormat = (value) => {
    return "https://vjweb.dskorea.com:10000/" + value;
}