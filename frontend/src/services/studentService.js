import axios from "axios";

const API_URL = "https://sms-backend-6rub.onrender.com/students";

export const getStudents = async (page = 1, limit = 5) => {
  const response = await axios.get(
    `${API_URL}?page=${page}&limit=${limit}`
  );

  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(API_URL, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    studentData
  );

  return response.data;
};

export const uploadPhoto = async (file) => {
  const formData = new FormData();

  formData.append("photo", file);

  const response = await axios.post(
    "https://sms-backend-6rub.onrender.com/students/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getActivityLogs = async () => {
  const response = await axios.get(
    "https://sms-backend-6rub.onrender.com/students/logs"
  );

  return response.data;
};