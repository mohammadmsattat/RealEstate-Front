import React from "react";

const SearchBar = () => {

  return (
    <div className="w-full">

      <input
        type="text"
        placeholder="Search location..."
        className="w-full border p-2 rounded"
      />

    </div>
  );
};

export default SearchBar;