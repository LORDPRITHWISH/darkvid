import UploadSpinner from "./UploadSpinner";

interface Props {
  uploading: boolean;
  onClick: () => void;
}

export default function AvatarEditButton({ uploading, onClick }: Props) {
  return (
    <button
      id="ch-edit-avatar-btn"
      onClick={onClick}
      disabled={uploading}
      title="Change profile picture"
      className="absolute inset-0 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center text-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 border-none disabled:cursor-not-allowed"
    >
      {uploading ? <UploadSpinner /> : "📷"}
    </button>
  );
}
