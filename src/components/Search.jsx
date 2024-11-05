import React, {useState, useEffect} from "react";
import SearchSidebar from "./Search/SearchSidebar";
import SearchContent from "./Search/SearchContent";
import {Helmet} from "react-helmet";

const Search = ({}) => {
    const [selectedResult, setSelectedResult] = useState()

    const handleSelectedResult = (result) => {
        setSelectedResult(result)
        console.log(result)
    }

    return (
        <>
        <Helmet>
            <title>Tìm kiếm</title>
        </Helmet>
        <div className="w-screen h-[calc(100vh-160px)] flex items-center justify-center">
            
            <div className="flex w-full h-full justify-center ">
                <SearchSidebar handleSelectedResult={handleSelectedResult}/>
                <div className="w-7/12 h-full flex justify-center">
                    <SearchContent result={selectedResult}/>
                </div>
            </div>
        </div></>
    )
}

export default Search