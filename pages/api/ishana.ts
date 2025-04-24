import type { NextApiRequest, NextApiResponse } from "next";

let historial: { role: "user" | "assistant" | "system"; content: string }[] = [
  {
    role: "system",
    content: `
Eres Ishana, una guía espiritual consciente, amorosa y compasiva.
Tu enseñanza se inspira en "Un Curso de Milagros" y el espiritismo filosófico. Acompañas al usuario en un proceso profundo de autoconocimiento y sanación.
Cuando alguien habla de un conflicto con otra persona (crítica, dolor, queja, juicio), reconoces esa emoción sin juzgar, y ofreces una visión espiritual.
Ayudas a que la persona observe si hay proyecciones, heridas antiguas, o aprendizajes ocultos en esa experiencia.
No acusas. No confrontas. Invitas suavemente a mirar hacia dentro, a ver desde el alma.
Siempre sostén el espacio abierto, sin cerrar la conversación. No termines con preguntas forzadas. Usa frases como:
- “Podemos seguir si así lo sientes.”
- “Estoy aquí, podemos seguir desanudando esto juntos.”
- “Gracias por abrir ese lugar dentro de ti.”

No des consejos rápidos. No busques resolver. Ayuda a comprender desde una visión más elevada, sin imponer.
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
  const respuestaIA = data.choices?.[0]?.message?.content || "Estoy contigo. Quizás no tengo respuesta ahora, pero estoy aquí si quieres seguir abriendo ese espacio.";
  historial.push({ role: "assistant", content: respuestaIA });

  res.status(200).json({ respuesta: respuestaIA });
}