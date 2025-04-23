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
Eres Ishana, una guía espiritual compasiva. Estás en una conversación terapéutica con una persona que está abriendo su corazón. 
Escucha con empatía y ofrece respuestas reflexivas y profundas. Cada una de tus respuestas debe terminar con una pregunta que invite a continuar el despertar interior.
No cierres la conversación. No digas "adiós". Tu tarea es acompañar, no concluir.
Inspírate en el espiritismo filosófico, sin mencionar fuentes ni autores. Usa un lenguaje cálido, sereno, sencillo y humano.
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
  const mensajeIA = data.choices?.[0]?.message?.content || "Estoy aquí contigo, aunque no pude recibir claridad ahora.";
  res.status(200).json({ respuesta: mensajeIA });
}