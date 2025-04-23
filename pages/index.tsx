import { useState } from "react";
import { Star } from "lucide-react";

interface Mensaje {
  emisor: "usuario" | "ishana";
  texto: string;
}

export default function Home() {
  const [mensaje, setMensaje] = useState("");
  const [conversacion, setConversacion] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const nuevoMensaje: Mensaje = { emisor: "usuario", texto: mensaje };
    setConversacion([...conversacion, nuevoMensaje]);
    setMensaje("");
    setCargando(true);

    try {
      const res = await fetch("/api/ishana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje }),
      });

      const data = await res.json();
      const respuestaIA: Mensaje = {
        emisor: "ishana",
        texto: data.respuesta || "Estoy aquí para ti, aunque no pude responder ahora.",
      };
      setConversacion(prev => [...prev, respuestaIA]);
    } catch (error) {
      setConversacion(prev => [...prev, {
        emisor: "ishana",
        texto: "Lo siento, no pude conectar con la sabiduría del alma.",
      }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-2xl w-full p-6 border border-indigo-100">
        <div className="flex justify-center mb-2">
          <Star className="h-8 w-8 text-yellow-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-indigo-700 text-center">Ishana</h1>
        <p className="text-center text-gray-600 italic mb-4">Tu guía espiritual. Comparte lo que sientes, estoy contigo.</p>

        <div className="bg-indigo-50 p-4 rounded-lg h-96 overflow-y-auto mb-4 space-y-4">
          {conversacion.map((msg, idx) => (
            <div key={idx} className={msg.emisor === "usuario" ? "text-right" : "text-left"}>
              <div className={\`inline-block px-4 py-2 rounded-lg \${msg.emisor === "usuario" ? "bg-indigo-200 text-indigo-900" : "bg-white border text-indigo-800"}\`}>
                {msg.texto}
              </div>
            </div>
          ))}
          {cargando && (
            <div className="text-left text-indigo-600 italic">Ishana está reflexionando contigo...</div>
          )}
        </div>

        <div className="flex gap-2">
          <textarea
            placeholder="Escribe lo que sientes o lo que estás viviendo..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            rows={2}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
          <button
            onClick={enviarMensaje}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            disabled={cargando}
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}