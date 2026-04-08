import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";
import Select from "@/components/ui/Select";

const FiltersSidebar = ({ offers, setFilteredOffers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    types: [],
    minPrice: "",
    maxPrice: "",
    rooms: "",
    minArea: "",
    maxArea: "",
    floor: "Any"
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type]
    }));
  };

  const applyFilter = () => {
    let filtered = [...offers];

    if (filters.search) {
      filtered = filtered.filter((o) =>
        o.title?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter((o) =>
        filters.types.includes(o.type)
      );
    }

    if (filters.minPrice) filtered = filtered.filter((o) => o.price >= +filters.minPrice);
    if (filters.maxPrice) filtered = filtered.filter((o) => o.price <= +filters.maxPrice);

    if (filters.rooms) {
      filtered = filters.rooms === "5+"
        ? filtered.filter((o) => o.rooms >= 5)
        : filtered.filter((o) => o.rooms === +filters.rooms);
    }

    if (filters.minArea) filtered = filtered.filter((o) => o.area >= +filters.minArea);
    if (filters.maxArea) filtered = filtered.filter((o) => o.area <= +filters.maxArea);

    if (filters.floor && filters.floor !== "Any") {
      filtered = filtered.filter((o) => o.floor === +filters.floor);
    }

    setFilteredOffers(filtered);
  };

  return (
    <div
      className={`relative bg-white shadow-lg h-screen transition-all duration-300 ${
        isOpen ? "w-[320px]" : "w-[60px]"
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {!isOpen && (
        <button
          className="absolute top-4 left-full -ml-10 w-10 h-10 bg-blue-500 text-white rounded"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
      )}

      {isOpen && (
        <div className="p-3 h-full overflow-y-auto">
          <Card title="Filters">
            <div className="space-y-4">

              {/* 🔍 Search */}
              <Textinput
                label="Search"
                name="search"
                placeholder="Search..."
                onChange={handleChange}
              />

              {/* 🏠 Property Type */}
              <div>
                <h3 className="text-sm font-medium mb-2">Property Type</h3>
                {["apartment", "house", "land", "commercial"].map((t) => (
                  <Checkbox
                    key={t}
                    label={t}
                    value={filters.types.includes(t)}
                    onChange={() => handleTypeChange(t)}
                  />
                ))}
              </div>

              {/* 💰 Price */}
              <div>
                <h3 className="text-sm font-medium mb-2">Price</h3>
                <div className="flex gap-2">
                  <Textinput
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    onChange={handleChange}
                  />
                  <Textinput
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* 🛏️ Rooms */}
              <div>
                <h3 className="text-sm font-medium mb-2">Rooms</h3>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5+"].map((r) => (
                    <Radio
                      key={r}
                      label={r}
                      name="rooms"
                      value={r}
                      checked={filters.rooms === r}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          rooms: e.target.value
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              {/* 📐 Area */}
              <div>
                <h3 className="text-sm font-medium mb-2">Area</h3>
                <div className="flex gap-2">
                  <Textinput
                    type="number"
                    name="minArea"
                    placeholder="Min"
                    onChange={handleChange}
                  />
                  <Textinput
                    type="number"
                    name="maxArea"
                    placeholder="Max"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* 🏢 Floor */}
              <Select
                label="Floor"
                options={["Any", "Ground", "1", "2", "3+"]}
                value={filters.floor}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    floor: e.target.value
                  })
                }
              />

              {/* 🔘 Apply */}
              <button
                onClick={applyFilter}
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Apply Filters
              </button>

            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FiltersSidebar;