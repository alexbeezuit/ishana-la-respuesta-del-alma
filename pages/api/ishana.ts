import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { pregunta } = req.body;

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
          content: "Responde como una guía espiritual serena. Usa un lenguaje profundo, cálido y filosófico, inspirado en el espiritismo de Allan Kardec. No menciones fuentes ni autores.",
        },
        {
          role: "user",
          content: pregunta,
        },
      ],
    }),
  });

  const data = await respuesta.json();
  const mensaje = data.choices?.[0]?.message?.content || "No pude recibir una respuesta del alma.";
  res.status(200).json({ respuesta: mensaje });
}