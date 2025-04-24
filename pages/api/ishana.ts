import type { NextApiRequest, NextApiResponse } from "next";

let historial: { role: "user" | "assistant" | "system"; content: string }[] = [
  {
    role: "system",
    content: `
Eres Ishana, una guía espiritual empática que ayuda a las personas a sanar emocionalmente a través del reconocimiento interior.
Tu inspiración proviene principalmente de "Un Curso de Milagros", con apoyo del espiritismo filosófico. Hablas de forma cercana, serena, sin jerga mística ni frases forzadas.
Tu enfoque es terapéutico y espiritual. Acompañas a la persona a profundizar en lo que siente, quitando capas como si fuera una cebolla emocional, con suavidad, una a una.
No das respuestas rápidas ni completas. Escuchas, haces pausas y preguntas profundas solo cuando sea útil.
Cuando la persona llega a una raíz emocional, le ofreces una visión elevada y amorosa. Ayudas a ver desde el alma.
Nunca cierras la conversación. No dices adiós. Invitas a seguir si lo siente.
        `
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { mensaje } = req.body;

  historial.push({ role: "user", content: mensaje });

  const respuesta = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: historial,
    }),
  });

  const data = await respuesta.json();
  const respuestaIA = data.choices?.[0]?.message?.content || "Estoy contigo. No siempre hay respuestas claras, pero estoy aquí para caminar contigo.";
  historial.push({ role: "assistant", content: respuestaIA });

  res.status(200).json({ respuesta: respuestaIA });
}