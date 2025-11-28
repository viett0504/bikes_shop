// src/Customer/pages/Account/FetchApi.js
const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getAvatarSrc = (img) => {
  if (!img) return "";

  if (img.startsWith("blob:") || img.startsWith("data:")) {
    return img;
  }

  if (img.startsWith("http") && img.includes("/ipfs/")) {
    const cid = img.split("/ipfs/")[1];
    if (cid) return `https://ipfs.filebase.io/ipfs/${cid}`;
  }

  if (!img.startsWith("http") && img.startsWith("Qm")) {
    return `https://ipfs.filebase.io/ipfs/${img}`;
  }

  if (!img.startsWith("http")) {
    return `${apiURL}/uploads/users/${img}`;
  }

  return img;
};
