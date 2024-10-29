'use client'

import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button
} from "@material-tailwind/react";

export default function SearchContent(props) {
  const {
    result
  } = props;

  return (
    <Card className="w-full max-w-5xl shadow-none border-blue-100 mx-9">
      <CardHeader className="max-w-5xl mt-8 text-center p-4 justify-between flex shadow-none border-none">
        <div>
        <div className=" justify-around flex flex-col h-full">
          <Typography variant="small" className="border border-gray-300 rounded px-2 py-1">
            {!result ? 'Đơn vị soạn thảo' : result.name}
          </Typography>
          <Typography variant="small" className="border border-gray-300 rounded px-2 py-1">
            {!result ? 'Văn bản số' : result.id}
          </Typography>
        </div>
        </div>
        <div className=' w-fit flex flex-col items-center justify-center'>
            <Typography variant="h5">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </Typography>
            <Typography>
            Độc lập - Tự do - Hạnh phúc
            </Typography>
            <Typography variant="small" className="mt-3 w-fit border border-gray-300 rounded px-2 py-1">
                {!result ? 'Thời gian soạn thảo' : result.date}
            </Typography>
        </div>
      </CardHeader>
      <CardBody className="p-6 max-w-5xl">
       
        <div className="border border-gray-300 rounded p-4 h-full min-h-96 mx-4">
          <Typography>{!result ? 'Toàn văn nội dung' : result.description}</Typography>
        </div>
      </CardBody>
      {!result ? '' : result.url && (
        <CardFooter className="pt-0 flex justify-end">
          <Button
            size="sm"
            variant="outlined"
            color="blue"
            ripple={true}
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            Tải file đính kèm
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}