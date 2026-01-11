import { ArtworksTable } from './components/ArtworksTable';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-column align-items-center">
      <header className="mt-8 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 mb-2">
          Art Institute Gallery
        </h1>
        <p className="text-slate-400">Curated artworks from the Art Institute of Chicago</p>
      </header>

      <main className="w-full max-w-7xl bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <ArtworksTable />
      </main>
    </div>
  )
}

export default App
