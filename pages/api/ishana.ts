import { useState } from "react";
import { Star } from "lucide-react";

export default function Home() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async () => {
    if (!pregunta.trim()) return;

    setCargando(true);
    setRespuesta("");

    try {
      const res = await fetch("/api/ishana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta }),
      });

      const data = await res.json();
      setRespuesta(data.respuesta || "No recibí respuesta del alma.");
    } catch (error) {
      setRespuesta("No pude conectar con la sabiduría del alma.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl max-w-xl w-full p-8 border border-indigo-100 text-center">
        <div className="flex justify-center mb-4">
          <Star className="h-10 w-10 text-yellow-500 animate-bounce" />
        </div>
        <h1 className="text-4xl font-bold text-indigo-700 mb-2">Ishana</h1>
        <p className="text-gray-600 italic mb-6">La Respuesta del Alma</p>

        <input
          type="text"
          placeholder="Escribe tu pregunta desde el corazón..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
        />
        <button
          onClick={manejarEnvio}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={cargando}
        >
          {cargando ? "Consultando al alma..." : "Enviar"}
        </button>

        {respuesta && (
          <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-indigo-900 shadow-inner text-left">
            <p className="font-semibold mb-1">Respuesta espiritual:</p>
            <p>{respuesta}</p>
          </div>
        )}
      </div>
    </main>
  );
}
