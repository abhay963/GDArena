import api from "./api";


// ========================================================
// UPLOAD DOCUMENT
// ========================================================

export const uploadDocument = async (
  file,
  userId = null
) => {

  const formData =
    new FormData();

  formData.append(
    "document",
    file
  );


  if (userId) {

    formData.append(
      "userId",
      userId
    );
  }


  const response =
    await api.post(
      "/api/documents/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );


  return response.data;
};


// ========================================================
// GET DOCUMENT PROCESSING STATUS
// ========================================================

export const getDocumentStatus = async (
  documentId
) => {

  const response =
    await api.get(
      `/api/documents/${documentId}/status`
    );


  return response.data;
};


// ========================================================
// ASK STUDYMATE
// ========================================================

export const askStudyMate = async ({
  documentId,
  question,
}) => {

  const response =
    await api.post(
      "/api/documents/ask",
      {
        documentId,
        question,
      }
    );


  return response.data;
};