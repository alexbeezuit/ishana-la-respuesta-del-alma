import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8 border border-indigo-100 text-center space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700">Ishana</h1>
        <p className="text-gray-600 italic">Elige cómo quieres iniciar tu camino interior</p>

        <div className="flex flex-col gap-4">
          <Link href="/ishana">
            <button className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              💬 Respuesta del alma
            </button>
          </Link>

          <Link href="/dejar-ir">
            <button className="bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
              🕊 Dejar ir
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}