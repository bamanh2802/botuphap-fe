import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { HomeIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const HeaderMain = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPage, setSelectedPage] = React.useState('');

    useEffect(() => {
        // Update selectedPage based on the current path
        setSelectedPage(location.pathname.replace('/', ''));
    }, [location.pathname]);

    const handleRouterToPages = (page) => {
        navigate(`/${page}`);
    };

    return (
       <div className="w-full flex justify-center items-center flex-col">
        <div className="py-1 w-full h-fit flex items-center justify-around bg-blue-200">
            <div className="flex flex-col justify-start text-white">
                <h1 className="font-bold text-lg ml-4">BỘ TƯ PHÁP</h1>
                <h3>HỆ THỐNG VĂN BẢN VÀ ĐIỀU HÀNH</h3>
            </div>
            <div className="w-6 h-9">
                <img src="/img/logo.png" alt="" />
            </div>
        </div>

        <div className="flex items-center w-full justify-start bg-blue-50">
            <div>
                <Button 
                    variant="text" 
                    className={`${selectedPage === '' && 'bg-blue-400'} flex items-center rounded-none`} 
                    onClick={() => handleRouterToPages('')}>
                    <HomeIcon className="w-4 h-4 mr-1"/>Trang chủ
                </Button>
            </div>
            <div>
                <Button 
                    variant="text" 
                    className={`${selectedPage === 'search' && 'bg-blue-400'} flex items-center rounded-none`} 
                    onClick={() => handleRouterToPages('search')}>
                    <MagnifyingGlassIcon className="w-4 h-4 mr-1"/>Tra cứu
                </Button>
            </div>
            <div>
                <Button 
                    variant="text" 
                    className={`${selectedPage === 'data-entry' && 'bg-blue-400'} flex items-center rounded-none`} 
                    onClick={() => handleRouterToPages('data-entry')}>
                    <DocumentTextIcon className="w-4 h-4 mr-1"/>Nhập dữ liệu
                </Button>
            </div>
            <div>
                <Button 
                    variant="text" 
                    className={`${selectedPage === 'text-editor' && 'bg-blue-400'} flex items-center rounded-none`} 
                    onClick={() => handleRouterToPages('text-editor')}>
                    <DocumentTextIcon className="w-4 h-4 mr-1"/>Soạn văn bản
                </Button>
            </div>
        </div>
       </div>
    );
};

export default HeaderMain;
