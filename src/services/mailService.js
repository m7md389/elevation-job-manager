import http from "./httpService";

const sendMail = (to, subject, text, html) => {
  console.log(to);
  http
    .post("/send-mail", {
      data: { to: to, subject: subject, text: text, html: html },
    })
    .then((result) => {
      if (result.error) {
        console.log(result);
      } else {
        console.log(result);
      }
    });
};

export default { sendMail };
