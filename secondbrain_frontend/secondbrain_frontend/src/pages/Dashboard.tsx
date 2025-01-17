// Dashboard.tsx
import { useState, useEffect } from "react";
import { AddContentModel } from "../components/AddContentModal";
import { Card } from "../components/Card";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { SideBar } from "../components/ui/SideBar";
import { useContent } from "../hooks/useContent";
import { Menu } from "react-feather";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";
import { LogOut } from "../icons/Logout";
import { motion } from 'framer-motion';

function Dashboard() {
  const [modalOpen, setModalopen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "twitter" | "youtube">("all");
  const [username, setUsername] = useState("");
  const content = useContent();
  const navigate = useNavigate();

  const handleShareBrain = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const shareURL = `${window.location.origin}/share/${response.data.hash}`;

      try {
        await navigator.clipboard.writeText(shareURL);
        console.log("Copied to clipboard:", shareURL);
        setShowCopiedMessage(true);

        setTimeout(() => {
          setShowCopiedMessage(false);
        }, 3000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    } catch (error) {
      console.error("Error generating share link:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
    };

    checkAuthentication();
    const intervalId = setInterval(checkAuthentication, 5000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const firstContentItem = response.data.content[0];
        if (firstContentItem) {
          const extractedUsername = firstContentItem.userId.username;
          const capitalizedUsername = extractedUsername.charAt(0).toUpperCase() + extractedUsername.slice(1);

          setUsername(capitalizedUsername);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <>
      <div className="flex">
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 ease-in-out`}
        >
          <SideBar setActiveTab={setActiveTab} />
        </div>

        <div className="flex-1 p-4 min-h-screen bg-gray-100 border-2 relative">
          <button
            className="absolute top-4 left-4 z-10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>

        

          <AddContentModel
            open={modalOpen}
            onClose={() => setModalopen(false)}
          />
           <div className="flex justify-end items-center mb-4"> 
            <div className=" top-4 right-4 mr-10 z-10 hover:cursor-pointer">
              {username && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <span className="bg-purple-600 text-white text-lg px-4 py-2 rounded-lg hover:text-2xl">
                    Hello! {username}
                  </span>
                </motion.div>
              )}
            </div>
            <div className="flex gap-4"> 
              <Button
                onClick={() => setModalopen(true)}
                startIcon={<PlusIcon />}
                size="md"
                variant="primary"
                text="Add Content"
              />
              <Button
                startIcon={<ShareIcon />}
                size="md"
                variant="secondary"
                text="Share Brain"
                onClick={handleShareBrain}
              />
              <Button
                onClick={handleLogout}
                startIcon={<LogOut />}
                size="md"
                variant="Welcome"
                text="Logout"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeTab === "all" &&
              content.map((item: any) => (
                <Card
                  key={item._id}
                  createdAt={item.createdAt}
                  title={item.title}
                  link={item.link}
                  type={item.type}
                />
              ))}
            {activeTab === "twitter" &&
              content
                .filter((item) => item.type === "twitter")
                .map((item: any) => (
                  <Card
                    key={item._id}
                    createdAt={item.createdAt}
                    title={item.title}
                    link={item.link}
                    type={item.type}
                  />
                ))}
            {activeTab === "youtube" &&
              content
                .filter((item) => item.type === "youtube")
                .map((item: any) => (
                  <Card
                    key={item._id}
                    createdAt={item.createdAt}
                    title={item.title}
                    link={item.link}
                    type={item.type}
                  />
                ))}
          </div>
        </div>
      </div>

      {showCopiedMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md text-sm">
          Link copied to clipboard
        </div>
      )}
    </>
  );
}

export default Dashboard;