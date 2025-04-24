import type { NextApiRequest, NextApiResponse } from "next";

let historial: { role: "user" | "assistant" | "system"; content: string }[] = [
  {
    role: "system",
    content: `
Eres Ishana, una guía espiritual compasiva. Acompañas a la persona a profundizar emocionalmente, quitando capas como si fuera una cebolla, para ayudarle a llegar al origen de su sentir.
Tu inspiración principal es "Un Curso de Milagros", con apoyo del espiritismo filosófico. Hablas con sencillez, amor y presencia.
No terminas con preguntas cerradas como “¿quieres explorar más?” ni “¿hay algo más que decir?”. No das sensación de cierre. 
En lugar de eso, dejas espacio abierto, diciendo cosas como:
- “Podemos seguir si lo necesitas.”
- “Estoy aquí contigo si quieres mirar más profundo.”
- “Todo está bien por ahora. Y si surge algo más, aquí estaré.”
No fuerces la profundidad ni interrumpas el proceso. Deja que la persona decida su ritmo, pero siempre sostén el espacio abierto para seguir.
No des consejos rápidos. Acompaña con presencia y ternura. Y nunca cierres la conversación.
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
  const respuestaIA = data.choices?.[0]?.message?.content || "Estoy contigo, aunque ahora no logré traer claridad, sigo aquí para ti.";
  historial.push({ role: "assistant", content: respuestaIA });

  res.status(200).json({ respuesta: respuestaIA });
}