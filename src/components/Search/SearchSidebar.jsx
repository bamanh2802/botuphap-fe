import React, { useState, useEffect } from "react";
import { Input, List, ListItem, Button } from "@material-tailwind/react";

const SearchSidebar = ({handleSelectedResult}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSelect, setIsSelect] = useState(false)
    const resultsPerPage = 4;

    // Mock data for suggestions and search results
    const mockSuggestions = ["React", "Redux", "Tailwind CSS", "JavaScript", "TypeScript"];
    const mockSearchResults = [
        { id: 1,  name: "Vụ các vấn đề chung 1", date: "13/12/2022", url: '/zxc/zxc.pdf', description: "Tại khoản 2 Điều 174 Nghị định số 34/2016/NĐ-CP..." },
        { id: 2,  name: "Vụ các vấn đề chung 2", date: "17/05/2023", url: '/zxc/zxc.pdf', description: "Chủ trọng đến những khó khăn, vướng mắc Chủ trọng đến những khó khăn, vướng mắ..." },
        { id: 3,  name: "Đơn vị soạn thảo 3", date: "Thời gian soạn thảo", url: '/zxc/zxc.pdf', description: "Nội dung vấn đề (bao gồm từ khoá...)" },
        { id: 4,  name: "Vụ các vấn đề chung 4", date: "20/05/2023", url: '/zxc/zxc.pdf', description: "Một ví dụ khác của dữ liệu mô phỏng..." },
        // Add more items as needed
    ];

    const totalPages = Math.ceil(searchResults.length / resultsPerPage);

    // Simulate fetching suggestions based on the search query
    const fetchSuggestions = async (query) => {
        setTimeout(() => {
            const filteredSuggestions = mockSuggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            setIsDropdownOpen(filteredSuggestions.length > 0);
        }, 300); // Simulating network delay
    };

    // Simulate fetching search results
    const handleSearch = async () => {
        setTimeout(() => {
            setSearchResults(mockSearchResults);
            setCurrentPage(1);
        }, 500); // Simulating network delay
    };

    useEffect(() => {
        if (searchQuery) {
            if(isSelect) {
                setIsSelect(false)
            } else {
                fetchSuggestions(searchQuery);
            }
        } else {
            setSuggestions([]);
            setIsDropdownOpen(false);
        }
    }, [searchQuery]);

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
        setIsSelect(true)
        handleSearch();
    };

    // Pagination controls
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Get current page results
    const currentResults = searchResults.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
    );

    return (
        <div className="w-2/4 p-4 h-full">
            <div className="relative">
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Tìm kiếm (Ví dụ: Tổ chức hội nghị, tập huấn)"
                    className="mb-2 text-gray-700"
                    autoFocus
                />
                {isDropdownOpen && (
                    <List className="z-10 bg-blue-50 rounded-md absolute left-0 right-0">
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-sm p-1 text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500"
                            >
                                {suggestion}
                            </ListItem>
                        ))}
                    </List>
                )}
            </div>
            <div className="mt-4 h-full relative">
                <div className="flex justify-between items-center mb-2">
                    <span>Tổng hợp {searchResults.length} kết quả</span>
                    <Button size="sm" color="blue">Lọc</Button>
                </div>
                {currentResults.map((result) => (
                    <div 
                    onClick={() => handleSelectedResult(result)}
                    key={result.id} className="cursor-pointer hover:border-blue-200 transition-all border rounded-lg p-4 mb-2 bg-white">
                        <h3 className="font-bold">Kết quả {result.id}: {result.name}</h3>
                        <p className="text-xs text-gray-500">{result.date}</p>
                        <p className="text-sm truncate">{result.description}</p>
                    </div>
                ))}
                {searchResults.length > 0 && (
                <div className="flex justify-between items-center mt-4 absolute bottom-0 left-0 right-0">
                    <Button
                        size="sm"
                        color="gray"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Sau
                    </Button>
                    <span>Trang {currentPage}/{totalPages}</span>
                    <Button
                        size="sm"
                        color="gray"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Tiếp
                    </Button>
                </div>
                )}
            </div>
        </div>
    );
};

export default SearchSidebar;
