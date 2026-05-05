import { Construction } from "lucide-react";

const ComingSoon = ({ title, description }: { title: string; description: string }) => (
  <div className="min-h-screen bg-zinc-950 text-white p-8 space-y-6">
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-full">
        <Construction size={36} className="text-zinc-500" />
      </div>
      <h2 className="text-white text-xl font-semibold">Coming Soon</h2>
      <p className="text-zinc-400 text-sm max-w-sm">{description}</p>
    </div>
  </div>
);

export function StudioSubtitles() {
  return (
    <ComingSoon
      title="Subtitles"
      description="Add and manage subtitles and closed captions for your videos. This feature is coming soon."
    />
  );
}

export function StudioEarn() {
  return (
    <ComingSoon
      title="Earn"
      description="Monetise your channel through memberships, super chats, and ad revenue. Creator monetisation tools are coming soon."
    />
  );
}

export function StudioAudioLibrary() {
  return (
    <ComingSoon
      title="Audio Library"
      description="Explore free music and sound effects you can use in your videos. The audio library is coming soon."
    />
  );
}

export function StudioSettings() {
  return (
    <ComingSoon
      title="Settings"
      description="Manage your studio preferences, notification settings, and upload defaults. Settings panel is coming soon."
    />
  );
}
