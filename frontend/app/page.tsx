"use client";

import { useState } from "react";

const COLOR_OPTIONS = [
  "Matte Black",
  "Ocean Blue",
  "Neon Pink",
  "Forest Green",
  "Titanium Silver",
  "Sunset Orange",
];

const PATTERN_OPTIONS = [
  "Geometric Diamond",
  "Carbon Fiber",
  "Floral Vine",
  "Circuit Board",
  "Camouflage",
  "Solid Clean",
];

const THEME_OPTIONS = [
  "Futuristic",
  "Sporty",
  "Nature",
  "Minimalist",
  "Cyberpunk",
  "Classic",
];

const MANUFACTURER_OPTIONS = [
  "Ottobock",
  "Össur",
  "Fillauer",
  "College Park Industries",
];

export default function Home() {
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [pattern, setPattern] = useState(PATTERN_OPTIONS[0]);
  const [theme, setTheme] = useState(THEME_OPTIONS[0]);
  const [manufacturer, setManufacturer] = useState(MANUFACTURER_OPTIONS[0]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
  setLoading(true);
  setStatus("Generating your design...");
  setImageUrl("");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color, pattern, theme, manufacturer }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus(`Design sent to ${manufacturer}!`);
      setImageUrl(data.imageUrl);
    } else {
      setStatus(`❌ Something went wrong: ${data.error}`);
    }
  } catch (err) {
    setStatus("❌ Failed to connect to server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Prosthetic Design Studio
        </h1>
        <p className="text-gray-400 text-lg">
          Design a prosthetic leg that feels like <span className="text-white font-semibold">you</span>.
        </p>
      </div>

      {/* Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">

        {/* Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Color Scheme
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Pattern */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Pattern
          </label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PATTERN_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Theme
          </label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {THEME_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Manufacturer */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Send to Manufacturer
          </label>
          <select
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MANUFACTURER_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors duration-200"
        >
          {loading ? "Generating..." : "Generate My Design"}
        </button>

        {/* Status */}
        {status && (
          <p className="mt-4 text-sm text-center text-gray-300">{status}</p>
        )}

        {/* Generated Image */}
        {imageUrl && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm text-gray-400 mb-3">Your Generated Design:</p>
            <img
              src={imageUrl}
              alt="Generated prosthetic design"
              className="rounded-xl w-full border border-gray-700 shadow-lg"
            />
            
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-blue-400 text-sm hover:underline"
            >
              View full size →
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-600 text-sm">
        Powered by Vizcom AI · Mastra MCP · Arcade.dev
      </p>
    </main>
  );
}