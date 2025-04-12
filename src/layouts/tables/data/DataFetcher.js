import { useState, useEffect } from "react";

const useFetchData = () => {
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:5000/api/leaves");
        const data = await response.json();
        setDataArray(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return dataArray; // Return the fetched data array
};

export default useFetchData;
