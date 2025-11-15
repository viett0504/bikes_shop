import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllAccount = async () => {
  try { const res = await axios.get(`${apiURL}/api/account/all-account`); return res.data; }
  catch (e) { console.log(e); }
};

export const createAccount = async (payload) => {
  const { name, email, password, position, phoneNumber} = payload;
  const form = new FormData();
  form.append("name", name); form.append("email", email);
  form.append("password", password); form.append("position", position);
  form.append("phoneNumber", phoneNumber);
  try { const res = await axios.post(`${apiURL}/api/account/add-account`, form); return res.data; }
  catch (e) { console.log(e); }
};

export const editAccount = async (account) => {
  const form = new FormData();
  form.append("id", account.id); form.append("name", account.name);
  form.append("password", account.password); form.append("position", account.position);
  form.append("phoneNumber", account.phoneNumber);

  try { const res = await axios.post(`${apiURL}/api/account/edit-account`, form); return res.data; }
  catch (e) { console.log(e); }
};

export const deleteAccount = async (id) => {
  try { const res = await axios.post(`${apiURL}/api/account/delete-account`, { id }); return res.data; }
  catch (e) { console.log(e); }
};
