import axios from "axios";
import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import water_fountains from "../assets/icons/location_types/water_fountains.jpg";
import green_spaces from "../assets/icons/location_types/green_spaces.jpg";
import activities from "../assets/icons/location_types/activities.jpg";

const Locations = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rangeValue, setRangeValue] = useState(300);
  const checkbox = ["Fountain", "Green Space", "Activity"];
  const [selectedRadio, setSelectedRadio] = useState("");
  const limit = 100;

  const normalizeData = (data, datasetType) => {
    return data.map((item) => {
      if (datasetType === "dataset1") {
        return {
          name: "Fontaine",
          type: item.type_objet,
          id: item.gid,
          pobox: item.commune,
          address: [item.no_voirie_pair, item.no_voirie_impair, item.voie]
            .filter(Boolean)
            .join(" "), // Concatenates with spaces, filters out null/undefined values
          geo_point_2d: item.geo_point_2d,
          geo_shape: item.geo_shape,
          available: item.dispo,
          icon: water_fountains,
          set: "Fountain",
        };
      } else if (datasetType === "dataset2") {
        return {
          name: item.nom,
          type: item.type,
          id: item.identifiant,
          pobox: item.arrondissement,
          address: item.adresse,
          geo_point_2d: item.geo_point_2d,
          geo_shape: item.geo_shape,
          available: item.statut_ouverture,
          icon: green_spaces,
          set: "Green Space",
        };
      } else if (datasetType === "dataset3") {
        return {
          name: item.nom,
          type: item.type,
          id: item.identifiant,
          pobox: item.arrondissement,
          address: item.adresse,
          geo_point_2d: item.geo_point_2d,
          geo_shape: item.geo_shape,
          available: item.statut_ouverture,
          icon: activities,
          set: "Activity",
        };
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      /*const limits = await Promise.all([
        axios.get(
          "https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records"
        ),
        axios.get(
          "https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records"
        ),
        axios.get(
          "https://opendata.paris.fr/api/explore/v2.0/catalog/datasets/ilots-de-fraicheur-equipements-activites/records"
        ),
      ]);

      const limit1 = limits[0].data.total_count;
      const limit2 = limits[1].data.total_count;
      const limit3 = limits[2].data.total_count;

    */

      try {
        const responses = await Promise.all([
          axios.get(
            "https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records",
            {
              params: {
                limit: limit,
              },
            }
          ),
          axios.get(
            "https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records",
            {
              params: {
                limit: limit,
              },
            }
          ),
          axios.get(
            "https://opendata.paris.fr/api/explore/v2.0/catalog/datasets/ilots-de-fraicheur-equipements-activites/records",
            {
              params: {
                limit: limit,
              },
            }
          ),
        ]);

        console.log(responses);

        // Add checks to ensure data exists and is an array
        const data1 = responses[0].data.results;
        const data2 = responses[1].data.results;
        const data3 = responses[2].data.records;

        const normalizedData1 = Array.isArray(data1)
          ? normalizeData(data1, "dataset1")
          : [data1];
        const normalizedData2 = Array.isArray(data2)
          ? normalizeData(data2, "dataset2")
          : [data2];
        let normalizedData3;
        if (Array.isArray(data3)) {
          const transformedData3 = data3
            .map((record) => record.record.fields)
            .filter(Boolean);
          normalizedData3 = normalizeData(transformedData3, "dataset3");
        } else {
          normalizedData3 = [data3]; // Handle non-array data3, though this should typically be an array
        }

        console.log(normalizedData1);
        console.log(normalizedData2);
        console.log(normalizedData3);

        // Combining the normalized data from the three requests
        const combined = [
          ...normalizedData1,
          ...normalizedData2,
          ...normalizedData3,
        ];
        setCombinedData(combined);

        console.log(combined);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter based on the search query and selected radio button
  const filteredData = combinedData.filter((location) => {
    const name = location.name ? location.name.toLowerCase() : "";
    const address = location.address ? location.address.toLowerCase() : "";
    const matchesSearchQuery =
      name.includes(searchQuery) || address.includes(searchQuery);
    const matchesRadioSelection =
      selectedRadio === "" || location.set === selectedRadio;

    return matchesSearchQuery && matchesRadioSelection;
  });

  // Then apply the range value to limit the number of displayed items
  const displayedData = filteredData.slice(0, rangeValue);

  return (
    <div>
      <ul className="radio-container">
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <input
          type="range"
          name="Range of Results:"
          min="1"
          max="300"
          value={rangeValue}
          onChange={(e) => setRangeValue(Number(e.target.value))}
        />
        {checkbox.map((set) => (
          <li key={set}>
            <input
              type="radio"
              id={set}
              name="RadioSet"
              checked={set === selectedRadio}
              onChange={(e) => setSelectedRadio(e.target.id)}
            />
            <label htmlFor={set}>{set}</label>
          </li>
        ))}
      </ul>
      {selectedRadio && (
        <button onClick={() => setSelectedRadio("")}>Reset</button>
      )}
      <ul>
        {displayedData.map((location, index) => (
          <Banner key={location.id || index} location={location} />
        ))}
      </ul>
    </div>
  );
};

export default Locations;
