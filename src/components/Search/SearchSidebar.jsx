import React, { useState, useEffect } from "react";
import { Input, Dropdown, DropdownItem } from "@material-tailwind/react";

const SearchSidebar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch suggestions when the search query changes
    useEffect(() => {
        if (searchQuery) {
            fetchSuggestions(searchQuery);
        } else {
            setSuggestions([]);
            setIsDropdownOpen(false);
        }
    }, [searchQuery]);

    // Fetch suggestions based on user input
    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`https://api.example.com/suggestions?query=${query}`);
            const data = await response.json();
            setSuggestions(data);
            setIsDropdownOpen(data.length > 0);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    // Handle pressing enter to fetch search results
    const handleSearch = async () => {
        try {
            const response = await fetch(`https://api.example.com/search?query=${searchQuery}`);
            const data = await response.json();
            console.log("Search results:", data);
            // Perform actions with the search results here
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle enter key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
            setIsDropdownOpen(false);
        }
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setIsDropdownOpen(false);
        handleSearch();
    };

    return (
        <div className="w-64 p-4 bg-blue-100 fixed h-full">
            <Input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                className="mb-2 text-gray-200"
            />
            {isDropdownOpen && (
                <Dropdown className="mt-2">
                    {suggestions.map((suggestion, index) => (
                        <DropdownItem
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="hover:bg-gray-700"
                        >
                            {suggestion}
                        </DropdownItem>
                    ))}
                </Dropdown>
            )}
        </div>
    );
};

export default SearchSidebar;
