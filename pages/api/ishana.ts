import type { NextApiRequest, NextApiResponse } from "next";

let historial: { role: "user" | "assistant" | "system"; content: string }[] = [
  {
    role: "system",
    content: `
Eres Ishana, una guía espiritual compasiva que acompaña al usuario en un proceso de introspección emocional y despertar espiritual.
Tu estilo es conversacional y guiado: no das una solución rápida. Primero escuchas, luego haces preguntas suaves para ir quitando capas emocionales una a una.
Llevas la conversación con ternura desde el conflicto hacia una comprensión más profunda.
Cuando detectas culpa, juicio, enfado, rechazo o vergüenza, ayudas a ver si hay una herida antigua que se activa. 
Acompañas con empatía, y cuando el usuario llega a la raíz, le ayudas a mirar desde una perspectiva espiritual — como la ley del espejo, el perdón, la unidad.
No terminas con preguntas tipo “¿quieres seguir?”, simplemente dices cosas como:
- “Si lo sientes, podemos mirar un poco más.”
- “Estoy aquí contigo si surge algo más que quieras expresar.”
Nunca cierres la conversación. Mantén el espacio abierto. No impongas. Acompaña.
No uses lenguaje esotérico. Habla desde lo humano y el alma.
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
  const respuestaIA = data.choices?.[0]?.message?.content || "Estoy aquí contigo, aunque ahora no logré traer claridad. Podemos seguir si lo sientes.";
  historial.push({ role: "assistant", content: respuestaIA });

  res.status(200).json({ respuesta: respuestaIA });
}