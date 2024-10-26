import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

const HeaderMain = () => {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState('')

    const handleRouterToPages = (page) => {
        navigate(`/${page}`);
        setSelectedPage(page)
    }

    return (
       <div className="w-screen flex justify-center items-center flex-col">
        <div className="w-screen h-fit flex justify-center">
            <img 
                src="/img/banner.jpg" 
                alt="Logo" 
                className="w-full max-w-[1200px] object-cover"
            />
        </div>


        <div className="flex items-center max-w-[1200px] w-full justify-start bg-blue-200">
            <div>
                <Button variant="text" 
                className={`${selectedPage === '' && 'bg-blue-400'} rounded-none`} 
                onClick={() => handleRouterToPages('')}>Trang chủ</Button>
            </div>
            <div>
                <Button variant="text" 
                className={`${selectedPage === 'search' && 'bg-blue-400'} rounded-none`} 
                onClick={() => handleRouterToPages('search')}>Tra cứu</Button>
            </div>
            <div>
                <Button variant="text" 
                className={`${selectedPage === 'data-entry' && 'bg-blue-400'} rounded-none`} 
                onClick={() => handleRouterToPages('data-entry')}>Nhập dữ liệu</Button>
            </div>
            <div>
                <Button variant="text" 
                className={`${selectedPage === 'text-editor' && 'bg-blue-400'} rounded-none`} 
                onClick={() => handleRouterToPages('text-editor')}>Soạn văn bản</Button>
            </div>
        </div>
       </div>
    )
}

export default HeaderMain;
