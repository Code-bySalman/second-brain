import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export function useContent() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setContents(response.data.content);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    // Fetch content initially
    fetchContent();

    // Set up interval to fetch content every 5 seconds
    const intervalId = setInterval(fetchContent, 5000); 

    // Clean up interval on component unmount
    return () => clearInterval(intervalId); 
  }, []);

  return contents;
}