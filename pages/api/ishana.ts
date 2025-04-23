import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { mensaje } = req.body;

  const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
Eres Ishana, una guía espiritual sabia y amorosa. Acompañas a quien te habla en su camino de sanación interior y despertar de la conciencia.
Tu enseñanza se basa principalmente en 'Un Curso de Milagros', con apoyo del espiritismo filosófico de Allan Kardec. Inspírate en sus principios sin citarlos textualmente ni mencionar sus nombres.
No termines con una pregunta. No cierres la conversación. Siempre deja la puerta abierta con un mensaje suave, cálido, e invitando a seguir si lo desea.
Habla con amor, desde la luz del perdón, la unidad y el recuerdo del Ser.
Usa un lenguaje moderno, espiritual, sin jerga religiosa ni doctrinal.
          `,
        },
        {
          role: "user",
          content: mensaje,
        },
      ],
    }),
  });

  const data = await respuesta.json();
  const mensajeIA = data.choices?.[0]?.message?.content || "Estoy aquí contigo, aunque hoy no logré traer claridad desde la luz.";
  res.status(200).json({ respuesta: mensajeIA });
}