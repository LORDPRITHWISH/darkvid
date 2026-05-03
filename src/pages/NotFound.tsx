const Notfound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-black">
      <h1 className="text-9xl font-extrabold font-sans text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)] tracking-tighter">404</h1>
      <h2 className="text-4xl font-bold font-sans text-white mt-8 mb-4 tracking-tight">Page Not Found</h2>
      <p className="text-lg text-gray-400 font-sans mb-8">The page you are looking for might have been removed,</p>
      <div className="flex gap-4">
        <button className="group relative cursor-pointer bg-slate-100 text-black px-6 py-3 rounded-full font-semibold hover:bg-slate-50 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Go to Home
        </button>
        <button className="group relative cursor-pointer border border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:border-white hover:bg-white/5 transition-all">
          Previous Page
        </button>
      </div>
      <div className="mt-16 w-full max-w-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Trending", href: "/trending" },
            { title: "Subscriptions", href: "/subscriptions" },
            { title: "Library", href: "/library" },
            { title: "History", href: "/history" },
            { title: "Explore", href: "/explore" },
            { title: "Playlists", href: "/playlists" },
            { title: "Settings", href: "/settings" },
            { title: "About", href: "/about" },
          ].map((item, index) => (
            <a key={index} href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
              → {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notfound;
