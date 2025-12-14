import { useUserStore } from "@/store/userStore";
import { Avatar, AvatarImage } from "../ui/avatar";
import { VanishInput } from "../ui/VanishInput";
import { useState } from "react";
import { addVideoComment } from "@/services/comment.service";
// import { Button } from "../ui/button";
// import { X } from "lucide-react";

interface CommentProps {
    videoId: string;
    onClose?: () => void;
    fetchComments?: () => void;
}

export function CommentCreation({ videoId, onClose, fetchComments }: CommentProps) {
  const { profilePhoto } = useUserStore();

  const [comment, setComment] = useState("");

  const placeholders = [
    "What are your thoughts on this video?",
    "That moment when... 🤯",
    "Anyone else notice that detail?",
    "What’s your take on this?",
    "Drop your opinion below 👇",
    "What part hit you the hardest?",
    "What did you learn from this?",
    "Could this be the best part yet?",
    "Your reaction in one word?",
    "What would you do differently?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    setComment(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await addVideoComment(videoId, comment);
    fetchComments?.();
    console.log("submitted", res);
  };
  return (
    <div className="w-full flex gap-4 justify-center  items-center px-6">
      <Avatar>
        <AvatarImage src={profilePhoto ?? "/default-avatar.png"} alt="user avatar" />
      </Avatar>
      <VanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} onClose={onClose} />

    </div>
  );
}
