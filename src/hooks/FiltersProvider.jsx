import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const FiltersContext = createContext();

export function useFilter() {
  return useContext(FiltersContext);
}
export function useAddFilter() {
  const { addFilter } = useContext(FiltersContext);
  return addFilter;
}

export default function FiltersProvider({ children }) {
  const [filters, setFilters] = useState([]);

  function addFilter(filter) {
    if (filter == "clear") {
      setFilters([]);
      return;
    }

    if (!filters.includes(filter))
      setFilters((prevFilters) => [...prevFilters, filter]);
  }

  function removeFilter(filterToRemove) {
    const newFilter = [];

    setFilters((prevFilter) => {
      for (let filter of prevFilter)
        if (filter != filterToRemove) newFilter.push(filter);
      return [...newFilter];
    });
  }

  return (
    <FiltersContext.Provider value={{ filters, addFilter, removeFilter }}>
      {children}
    </FiltersContext.Provider>
  );
}
