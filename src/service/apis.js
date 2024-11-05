import API_PATH from "./API_PATH";
import axios from 'axios';

export const getByIdEndpoint = async (id) => {
    const response = await axios.get(
        `${API_PATH}/${id}`, {
            headers: {
                'accept': 'application/json'
            }
        }
    );

    return response;
};

export const getByTenPhong = async (tenPhong) => {
    const response = await axios.get(
        `${API_PATH}/filter/phong`
    )
}

export const searchNoiDungChinh = async (noiDung) => {
    const response = await axios.get(
        `${API_PATH}/search/noi-dung-chinh`, {
            params: {
                noi_dung: noiDung
            },
            headers: {
                'accept': 'application/json'
            }
        }
    );

    return response;
};
export const searchCauHoi = async (cauHoi, offset = 0) => {
    const response = await axios.get(
        `${API_PATH}/search/cau-hoi`, {
            params: {
                cau_hoi: cauHoi,
                offset: offset
            },
            headers: {
                'accept': 'application/json'
            }
        }
    );

    return response;
};

export const searchCauTraLoi = async (cauTraLoi) => {
    const response = await axios.get(
        `${API_PATH}/search/cau-tra-loi`, {
            params: {
                cau_tra_loi: cauTraLoi
            },
            headers: {
                'accept': 'application/json'
            }
        }
    );

    return response;
};
export const uploadFile = async (files) => {
    const formData = new FormData();
  
    // Duyệt qua danh sách các file và thêm từng file vào FormData
    files.forEach((file) => {
      formData.append('files', file);
    });
  
    const response = await fetch(`${API_PATH}/upload`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
      body: formData,
    });
  
    const data = await response.json();
    return data;
  };
  