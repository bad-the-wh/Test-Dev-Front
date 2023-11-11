import axios from "axios";
import React, { useEffect, useState } from "react";

const Locations = () => {
  //
  const [data, setData] = useState([]);

  useEffect(() => {
    // URLs of the three datasets
    const url1 =
      "https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records";
    const url2 =
      "https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records";
    const url3 =
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records";

    // Create an array of promises for each GET request
    const requests = [axios.get(url1), axios.get(url2), axios.get(url3)];

    // Use Promise.all to wait for all requests to complete
    Promise.all(requests)
      .then((responses) => {
        // Assuming each response.data is JSON
        const data1 = Array.isArray(responses[0].data)
          ? responses[0].data
          : [responses[0].data];
        const data2 = Array.isArray(responses[1].data)
          ? responses[1].data
          : [responses[1].data];
        const data3 = Array.isArray(responses[2].data)
          ? responses[2].data
          : [responses[2].data];

        // Combine the data from all datasets
        const combinedData = [...data1, ...data2, ...data3];

        console.log("Combined Data", combinedData);

        // Set the combined data to the state variable
        setData(combinedData);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <div className="locations">
        <h1>LOCATIONS</h1>

        <ul>
          {data.map((location) => (
            <li>{location.nom}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Locations;
