
export default function About() {
  return (
    <div className="min-h-screen px-4 py-10 bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">About DarkVid</h1>
      <p className="text-lg max-w-3xl text-center mb-6 text-slate-400">
        DarkVid is a high-performance video sharing platform built by <span className="font-bold brightness-200">DarkLord</span>, designed for speed, simplicity, and power.
        Crafted using bleeding-edge tech like React, Next.js, Tailwind CSS, and a custom backend with Node and Express, it's engineered for creators who want control.
      </p>
      <div className="grid gap-4 md:grid-cols-2 max-w-4xl w-full">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Why DarkVid?</h2>
          <ul className="list-disc list-inside text-gray-400">
            <li>Fast uploads & streaming</li>
            <li>Clean, no-BS UI</li>
            <li>Dev-friendly APIs</li>
            <li>Privacy-first approach</li>
          </ul>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Stack</h2>
          <ul className="list-disc list-inside text-gray-400">
            <li>Next.js + TypeScript + Tailwind</li>
            <li>Node.js + Express + MongoDB</li>
            <li>FFmpeg for video processing</li>
            <li>Socket.IO for live updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
