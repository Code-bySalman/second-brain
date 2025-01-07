import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./ui/Button";
import { useState, useEffect, useRef } from 'react';
import { Input } from "./ui/Input";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { motion } from 'framer-motion';

enum ContentType {
  Youtube = "youtube",
  Twitter = "twitter"
}

export function AddContentModel({ open, onClose }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  async function addContent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    if (title && link) {
      setIsLoading(true);

      try {
        await axios.post(`${BACKEND_URL}/api/v1/content`, {
          link,
          title,
          type
        }, {
          headers: {
            Authorization: localStorage.getItem("token") || ""
          }
        });

        onClose();
      } catch (error) {
        console.error("Error adding content:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);


  return (
    <div>
      {open && <div>
        <div className="fixed inset-0 bg-slate-700 opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6 w-96"
            ref={modalRef}
          >
            <div className="flex justify-end mb-4">
              <div onClick={onClose} className="cursor-pointer">
                <CrossIcon />
              </div>
            </div>
            <div className="mb-4">
              <Input reference={titleRef} placeholder={"Title"} />
              <Input reference={linkRef} placeholder={"Link"} />
            </div>
            <h2 className="text-lg font-medium mb-2">Type</h2>
            <div className="flex justify-start gap-2 mb-4">
              <Button
                text="Youtube"
                variant={type === ContentType.Youtube ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Youtube)}
              />
              <Button
                text="Twitter"
                variant={type === ContentType.Twitter ? "primary" : "secondary"}
                onClick={() => setType(ContentType.Twitter)}
              />
            </div>
            <div className="flex justify-center">
              <Button
                onClick={addContent}
                variant="primary"
                text={isLoading ? "Loading..." : "Submit"}
                disabled={isLoading}
                className={isLoading ? "opacity-70" : ""}
              />
            </div>
          </motion.div>
        </div>
      </div>}
    </div>
  );
}