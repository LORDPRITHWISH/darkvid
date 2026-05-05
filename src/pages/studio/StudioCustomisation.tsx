import { useNavigate } from "react-router";
import { ExternalLink } from "lucide-react";

/** Studio Customisation – redirects to the channel's own customisation page */
export default function StudioCustomisation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Channel Customisation</h1>
        <p className="text-zinc-400 mt-1">
          Update your channel profile, banner, and bio
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col items-center gap-6 text-center">
        <div className="p-4 bg-zinc-800 rounded-full">
          <ExternalLink size={28} className="text-zinc-300" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">Edit your channel</p>
          <p className="text-zinc-400 text-sm mt-1 max-w-sm">
            Manage your channel's profile picture, banner image, name, and bio
            from your channel page.
          </p>
        </div>
        <button
          onClick={() => navigate("/channel")}
          className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Go to Channel Page
        </button>
      </div>
    </div>
  );
}
