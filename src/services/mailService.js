import http from "./httpService";

const sendMail = (to, subject, text, html) => {
  http.post("/send-mail", (ex, result) => {});
};

export default { sendMail };
