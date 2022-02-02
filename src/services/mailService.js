import http from "./httpService";

const sendMail = (to, subject, text, html) => {
  const apiEndPoint = "/mail";
  http.post(apiEndPoint, { to, subject, text, html });
};

export default { sendMail };
