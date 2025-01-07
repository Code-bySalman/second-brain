// SharedContent.tsx
import { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Card } from "../components/Card";

interface SharedContentProps {
  hash: string;
}

function SharedContent(props: SharedContentProps) {
  const { hash } = props;
  const [content, setContent] = useState([]);
  const [username, setUsername] = useState(""); // Add username state

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/brain/${hash}`);
        setContent(response.data.content);
        setUsername(response.data.username); // Set username from response
      } catch (error) {
        console.error("Error fetching shared content:", error);
      }
    };

    fetchSharedContent();
  }, [hash]);

  return (
    <div className="container mx-auto p-4">
      {username && ( // Display username if available
        <h2 className="text-2xl font-bold mb-4">Shared by: {username}</h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {content.map((item:any) => (
          <Card
            key={item.createdAt}
            createdAt={item.createdAt}
            title={item.title}
            link={item.link}
            type={item.type}
            showDelete={false} 
          />
        ))}
      </div>
    </div>
  );
}

export default SharedContent;