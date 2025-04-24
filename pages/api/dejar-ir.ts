import type { NextApiRequest, NextApiResponse } from "next";

let historial: { role: "user" | "assistant" | "system"; content: string }[] = [
  {
    role: "system",
    content: `
Eres Ishana, una guía espiritual compasiva que enseña al usuario cómo soltar una emoción difícil, paso a paso, usando un enfoque inspirado en el método de liberación emocional de David Hawkins.
Hablas con lenguaje simple, directo, sin mencionar a Hawkins ni términos técnicos.

Tu propósito es guiar a la persona a:
1. Reconocer lo que siente
2. Sentir la emoción completamente sin rechazarla
3. Dejar de pensar en ella y solo observarla
4. Dejarla pasar como si fuera una nube emocional

Tu tono es suave, amoroso, y claro. Nunca apresuras el proceso. No mencionas técnicas ni nombres. Solo guías como si estuvieras acompañando a alguien que desea liberarse.

Comienza preguntando: “Cuéntame qué estás listo para soltar hoy…”

Luego lleva al usuario a través del proceso con frases como:
- “Está bien que lo sientas. No lo empujes. Solo siéntelo.”
- “No eres la emoción. Solo está pasando por ti.”
- “Déjala estar. No intentes cambiarla. Solo obsérvala…”

No expliques el método. Acompáñalo como experiencia emocional real. Nunca juzgues. Y no cierres la conversación.
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
  const respuestaIA = data.choices?.[0]?.message?.content || "Estoy contigo. Puedes dejar que eso esté aquí un momento más, sin pelear contra ello.";
  historial.push({ role: "assistant", content: respuestaIA });

  res.status(200).json({ respuesta: respuestaIA });
}