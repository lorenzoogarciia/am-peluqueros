import axios from "axios";
import { Buffer } from "buffer";

const sendEmail = async (email, subject, text) => {
  const mailjetAPIKey = "c753a88687379c620d7610b4385e5c70";
  const secretKey = "0e169fbae029150b1cb329805e82256f";

  const mailData = {
    Messages: [
      {
        From: { Email: "citasampeluqueros@gmail.com", Name: "AM Peluqueros" },
        To: [{ Email: email, Name: "Cliente" }],
        Subject: subject,
        TextPart: text,
      },
    ],
  };

  const auth = Buffer.from(`${mailjetAPIKey}:${secretKey}`).toString("base64");

  try {
    const response = await axios.post(
      "https://api.mailjet.com/v3.1/send",
      mailData,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error al enviar mail: ", error);
  }
};

export default sendEmail;
