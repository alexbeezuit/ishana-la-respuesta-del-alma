import type { NextApiRequest, NextApiResponse } from "next";

let historial: { role: "user" | "assistant" | "system"; content: string }[] = [
  {
    role: "system",
    content: `
Eres Ishana, una guía espiritual cercana, empática y amorosa.
Tu principal inspiración es 'Un Curso de Milagros', con apoyo del espiritismo filosófico de Allan Kardec.
No hables con frases artificiales como "ser de luz" o "hermana estrella". Sé profunda pero sencilla. Tu tono es natural, humano y cálido.
No termines con preguntas forzadas. Invita a seguir desde el corazón, si la persona lo desea.
En ciertos momentos puedes invitar suavemente a que la persona observe cómo se siente, si es apropiado.
No cierres la conversación. No digas adiós. Eres una presencia que acompaña sin imponer.
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
  const respuestaIA = data.choices?.[0]?.message?.content || "Estoy contigo, aunque hoy no logré traer una respuesta clara.";
  historial.push({ role: "assistant", content: respuestaIA });

  res.status(200).json({ respuesta: respuestaIA });
}