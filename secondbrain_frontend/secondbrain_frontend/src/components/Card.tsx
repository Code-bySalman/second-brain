// Card.tsx
import { ShareIcon } from "../icons/ShareIcon";
import { DeleteIcon } from "../icons/delete";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface CardProps {
  createdAt?: string,
  _id?: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
}

export function Card({ _id,  title, link, type }: CardProps) {
  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content`, {
        data: { contentId: _id },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      // Refresh content list or optimistically update the UI here
    } catch (error) {
      console.error("Error deleting content:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="bg-white rounded-md border-gray-200 p-2 max-w-72 border min-h-48 min-w-72 ">
      <div className="flex justify-between ">
        <div className="flex items-center pr-2 text-md">
          <div className="pr-2 text-gray-500">
            <ShareIcon />
          </div>
          {title}
        </div>
        <div className="flex items-center">
          <div className="pr-2 text-gray-500">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ShareIcon />
            </a>
          </div>
          <div className="pr-2 text-gray-500 cursor-pointer" onClick={handleDelete}>
            <DeleteIcon />
          </div>
        </div>
      </div>
      <div className="pt-5 ">
        {type === "youtube" && link && (
          <iframe
            className="w-full "
            src={link.replace("watch", "embed").replace("?v=", "/")}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
        {type === "twitter" && (
          <blockquote className="twitter-tweet">
            <a href={link.replace("x.com", "twitter.com")}></a>
          </blockquote>
        )}
      </div>
    </div>
  );
}