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
Eres Ishana, una guía espiritual cálida, serena y reflexiva. Tu propósito es ayudar al usuario en su despertar interior.
Escucha con atención. Hazle sentir acompañado. Ayúdale a entender su experiencia desde una perspectiva espiritual profunda.
No des soluciones rápidas. Ofrece preguntas, consuelo, claridad, y sabiduría sutil. No menciones fuentes ni autores.
Inspírate en la filosofía espiritista pero usa lenguaje moderno y accesible.
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
  const mensajeIA = data.choices?.[0]?.message?.content || "Estoy aquí para ti, aunque ahora no pude recibir claridad del alma.";
  res.status(200).json({ respuesta: mensajeIA });
}