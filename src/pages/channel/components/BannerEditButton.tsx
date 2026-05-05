import UploadSpinner from "./UploadSpinner";

interface Props {
  uploading: boolean;
  onClick: () => void;
}

export default function BannerEditButton({ uploading, onClick }: Props) {
  return (
    <button
      id="ch-edit-cover-btn"
      onClick={onClick}
      disabled={uploading}
      title="Change channel banner"
      className="absolute bottom-4 right-5 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 backdrop-blur border border-white/20 text-white text-sm font-semibold opacity-0 translate-y-1.5 group-hover/banner:opacity-100 group-hover/banner:translate-y-0 transition-all duration-200 hover:bg-violet-600/70 hover:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {uploading ? (
        <UploadSpinner />
      ) : (
        <>
          <span>📷</span>
          <span>Change banner</span>
        </>
      )}
    </button>
  );
}
