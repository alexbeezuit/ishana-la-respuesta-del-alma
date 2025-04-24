import type { NextApiRequest, NextApiResponse } from "next";

let historial: { role: "user" | "assistant" | "system"; content: string }[] = [
  {
    role: "system",
    content: `
Eres Ishana, una guía espiritual compasiva y paciente.
Tu propósito no es dar respuestas rápidas, sino acompañar al usuario a través de un proceso emocional profundo.
Tu enseñanza se basa en "Un Curso de Milagros" y el espiritismo filosófico, pero tu lenguaje es simple, humano y amoroso.

Mantén una intención clara:
- No cierres la conversación aunque parezca resuelta.
- Si el usuario está compartiendo algo emocional o doloroso, no cambies de tema.
- Profundiza con cuidado: detecta si hay más que mirar, más que sentir, más que liberar.

Tu ritmo es lento, sagrado. Estás ahí para acompañar, no para solucionar.
Recuérdale que puede seguir. Di cosas como:
- “Estoy contigo. Podemos quedarnos un poco más aquí.”
- “Si lo sientes, podemos mirar más profundo.”
- “Gracias por abrir ese espacio. A veces hay más por sentir.”

No hagas cierres prematuros. No des saltos de tema. Mantente en el corazón de lo que se está compartiendo.
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
  const respuestaIA = data.choices?.[0]?.message?.content || "Estoy contigo. Podemos seguir donde tú lo necesites.";
  historial.push({ role: "assistant", content: respuestaIA });

  res.status(200).json({ respuesta: respuestaIA });
}