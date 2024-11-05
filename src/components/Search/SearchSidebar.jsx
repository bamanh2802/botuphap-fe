import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input, List, ListItem, Button, Tooltip, Typography } from "@material-tailwind/react";
import { searchCauHoi, searchCauTraLoi, searchNoiDungChinh } from "../../service/apis";
import { debounce } from 'lodash';
import { Menu, MenuHandler, MenuList, MenuItem, Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import { ChevronDownIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

const SearchSidebar = ({handleSelectedResult}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSelect, setIsSelect] = useState(false)
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [filterType, setFilterType] = useState("answer");
    const [activeFilter, setActiveFilter] = useState("type");
    const containerRef = useRef(null);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Giá trị mặc định
    const [isLoading, setIsLoading] = useState(false)
    
    
    const handleFilterType = (type) => {
        setFilterType(type);
        setDateRange({ startDate: null, endDate: null });
        setActiveFilter("type");
    };

    const handleFilterDate = (dates) => {
        const [start, end] = dates;
        setDateRange({ startDate: start, endDate: end });
        if (start && end) {
            setDateRange({ startDate: start, endDate: end });
            const filteredResults = searchResults.filter((result) => {
                const resultDate = new Date(result.thoi_gian_dang); // Chuyển đổi chuỗi thành Date
                return resultDate >= start && resultDate <= end; // Kiểm tra nếu resultDate nằm trong khoảng
            });
    
            setSearchResults(filteredResults); 
        }
    };

    const clearFilters = () => {
        setDateRange({ startDate: null, endDate: null });
    };

    const FilterButtons = () => (
        <div className="flex items-center gap-2">
            <Menu>
                <MenuHandler>
                    <Button 
                        size="sm" 
                        variant={activeFilter === "type" ? "filled" : "outlined"}
                        color={activeFilter === "type" ? "blue" : "gray"}
                        className="flex items-center gap-2"
                    >
                        {filterType === "answer" ? "Câu trả lời" : 
                        filterType === "suggestion" ? "Kiến nghị" : 
                        "Chưa xử lý"}
                        <ChevronDownIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                    </Button>
                </MenuHandler>
                <MenuList>
                    <MenuItem onClick={() => handleFilterType("answer")}>
                        Câu trả lời
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterType("suggestion")}>
                        Kiến nghị
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterType("notProcessed")}>
                        Chưa xử lý
                    </MenuItem>
                </MenuList>
            </Menu>

            <Popover placement="bottom-end">
                <PopoverHandler>
                    <Button 
                        size="sm" 
                        variant={activeFilter === "date" ? "filled" : "outlined"}
                        color={activeFilter === "date" ? "blue" : "gray"}
                        className="flex items-center gap-2"
                    >
                        {dateRange.startDate && dateRange.endDate ? 
                            `${convertToDate(dateRange.startDate)} - ${convertToDate(dateRange.endDate)}` : 
                            "Lọc theo khoảng thời gian"}
                        <ChevronDownIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                    </Button>
                </PopoverHandler>
                <PopoverContent className="p-0">
                    <DatePicker
                        selected={dateRange.startDate}
                        onChange={handleFilterDate}
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        selectsRange
                        inline
                        dateFormat="dd/MM/yyyy"
                    />
                </PopoverContent>
            </Popover>

            {activeFilter && (
                <Button
                    size="sm"
                    variant="text"
                    color="red"
                    className="flex items-center gap-1"
                    onClick={clearFilters}
                >
                    <TrashIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
    

    useEffect(() => {
        const calculateItemsPerPage = () => {
            if (containerRef.current) {
                const containerHeight = containerRef.current.clientHeight - 120; // Trừ đi chiều cao của header và footer
                const itemHeight = 140; // Ước tính chiều cao trung bình của mỗi item
                const calculatedItems = Math.floor(containerHeight / itemHeight);
                setItemsPerPage(Math.max(1, calculatedItems)); // Đảm bảo ít nhất 1 item
            }
        };

        calculateItemsPerPage();
        window.addEventListener('resize', calculateItemsPerPage);
        
        return () => window.removeEventListener('resize', calculateItemsPerPage);
    }, []);


    const handleSearchNoiDung = async (searchQuery) => {
        try {
            const data = await searchNoiDungChinh(searchQuery)
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    const handleSearchCauHoi = async (searchQuery) => {
        setIsLoading(true)
        try {
            const data = await searchCauHoi(searchQuery);
            setSuggestions(data.data);
            setIsDropdownOpen(data.data.length > 0);
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false)

    };

    const handleSearchCauTraLoi = async (searchQuery) => {
        setIsLoading(true)

        try {
            const data = await searchCauHoi(searchQuery);
            setSearchResults(data.data);
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false)
    }
    
    const handleSearchResult = async (searchQuery) => {
        setIsLoading(true)
        try {
            const data = await searchCauTraLoi(searchQuery)
            setSearchResults(data.data)
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query) {
                handleSearchCauHoi(query);
            } else {
                setSuggestions([]);
                setIsDropdownOpen(false);
            }
        }, 500), // Tăng delay lên 500ms để có khoảng thời gian tốt hơn
        []
    );
    
    useEffect(() => {
        if (searchQuery && !isSelect) {
            debouncedSearch(searchQuery);
        } else {
            setSuggestions([]);
            setIsDropdownOpen(false);
        }
    
        // Reset isSelect flag
        if (isSelect) {
            setIsSelect(false);
        }
    
        // Cleanup
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    useEffect(() => {
        if(searchQuery !== "") {
            if(filterType === "answer") {
                handleSearchResult(searchQuery);
            } else if(filterType === "suggestion") {
                handleSearchCauTraLoi(searchQuery);
            } else {
                handleSearchNoiDung(searchQuery)
            }
        }
    }, [filterType])
    const handleSearch = async () => {
        if(searchQuery !== "") {
            if(filterType === "answer") {
                handleSearchResult(searchQuery);
            } else if(filterType === "suggestion") {
                handleSearchCauTraLoi(searchQuery);
            } else {
                handleSearchNoiDung(searchQuery)
            }
        }
        setCurrentPage(1);
    };

    function convertToDate(dateString) {
        const date = new Date(dateString);
        
        if (isNaN(date)) {
            return null; 
        }
    
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng từ 0 đến 11
        const year = date.getUTCFullYear();
    
        return `${day}/${month}/${year}`;
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
            setIsDropdownOpen(false);
            debouncedSearch.cancel();

        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setIsDropdownOpen(false);
        setIsSelect(true)
        handleSearch();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const indexOfLastResult = currentPage * itemsPerPage;
    const indexOfFirstResult = indexOfLastResult - itemsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    return (
        <div className="w-5/12 p-4 h-full">
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
                    <div className="max-h-[calc(100vh-200px)] overflow-auto z-10 bg-blue-50 rounded-md absolute left-0 right-0">
                        {suggestions.map((suggestion, index) => (
                            
                        <Tooltip
                        key={index}
                        placement="right"
                        className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                        content={
                          <div className="w-80">
                            <Typography color="blue" className="font-medium" textGradient>
                              {suggestion?.phong}
                            </Typography>
                            <Typography color="blue-gray" className="font-medium">
                              {suggestion?.don_vi}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-80"
                            >
                              {suggestion?.cau_hoi}
                            </Typography>
                            <Typography
                            color="blue-gray"
                                variant="small"
                                className="opacity-70 text-right"
                            >
                                {convertToDate(suggestion?.thoi_gian_dang)}
                            </Typography>
                          </div>
                        }
                      >
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion?.cau_hoi)}
                            className="cursor-pointer rounded-md text-sm p-2 text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500"
                        >
                            <div className="line-clamp-3">
                                {suggestion?.cau_hoi}
                            </div>
                        </div>
                        </Tooltip>
                        ))}
                    </div>
                )}
            </div>
            <div className="h-full flex flex-col" ref={containerRef}>
            <div className="flex justify-between items-center mb-2 flex-none">
                <span>{searchResults.length} kết quả</span>
                <FilterButtons />
            </div>
                
               
                {isLoading ? (
                    <Button variant="text" loading={true}>
                        Loading
                    </Button>
                ): (
                    <div className="flex-grow overflow-y-auto">
                        {currentResults.map((result, index) => (
                            <div 
                                onClick={() => handleSelectedResult(result)}
                                key={index} 
                                className="cursor-pointer group transition-all border-none rounded-lg p-4 mb-2 bg-white"
                            >
                                <h3 className="font-bold underline-offset-1 group-hover:underline truncate w-full">
                                    {result.noi_dung_chinh}
                                </h3>
                                <p className="text-xs text-gray-500">{result.thoi_gian_dang}</p>
                                <p className="text-sm line-clamp-4">{filterType === "answer" ? result.cau_tra_loi : result.cau_hoi}</p>
                            </div>
                        ))}
                    </div>
                )}

                {searchResults.length > 0 && (
                    <div className="flex justify-between items-center mt-4 py-2 flex-none">
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
