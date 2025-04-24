import { useState } from "react";
import { Star } from "lucide-react";

interface Mensaje {
  emisor: "usuario" | "ishana";
  texto: string;
}

export default function DejarIr() {
  const [mensaje, setMensaje] = useState("");
  const [conversacion, setConversacion] = useState<Mensaje[]>([
    {
      emisor: "ishana",
      texto: "Cuéntame qué estás listo para soltar hoy…",
    },
  ]);
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async () => {
    if (!mensaje.trim()) return;

    const nuevoMensaje: Mensaje = { emisor: "usuario", texto: mensaje };
    setConversacion([...conversacion, nuevoMensaje]);
    setMensaje("");
    setCargando(true);

    try {
      const res = await fetch("/api/dejar-ir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje }),
      });

      const data = await res.json();
      const respuestaIA: Mensaje = {
        emisor: "ishana",
        texto: data.respuesta || "Estoy contigo. Puedes dejar que eso esté aquí un momento más, sin pelear contra ello.",
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
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full h-[90vh] flex flex-col border border-indigo-100 overflow-hidden">
        <div className="flex items-center justify-center p-3 border-b bg-purple-50">
          <Star className="h-6 w-6 text-purple-500 animate-pulse mr-2" />
          <h1 className="text-xl font-semibold text-purple-700">Dejar ir</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {conversacion.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.emisor === "usuario" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 text-sm shadow-sm max-w-[80%] ${
                  msg.emisor === "usuario"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-800"
                }`}
              >
                {msg.texto}
              </div>
            </div>
          ))}
          {cargando && (
            <div className="text-left text-purple-500 italic">Ishana está contigo…</div>
          )}
        </div>

        <div className="p-3 border-t bg-white flex gap-2">
          <textarea
            placeholder="Escribe lo que deseas soltar..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none text-sm"
            rows={2}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          />
          <button
            onClick={enviarMensaje}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
            disabled={cargando}
          >
            Soltar
          </button>
        </div>
      </div>
    </main>
  );
}