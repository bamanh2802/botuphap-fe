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
import { Document, Page, pdfjs } from 'react-pdf';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer'; // Thư viện hiển thị file .docx

export default function SearchContent(props) {
  const { result } = props;
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

  return (
    <Card className="w-full max-w-5xl shadow-none border-blue-100 mx-9">
      <CardHeader className="max-w-5xl mt-8 text-center p-4 justify-between flex shadow-none border-none">
        <div>
          <div className="justify-around flex flex-col h-full">
            <Typography variant="small" className="border border-gray-300 rounded px-2 py-1">
              {!result ? 'Phòng' : result.phong}
            </Typography>
            <Typography variant="small" className="border border-gray-300 rounded px-2 py-1">
              {!result ? 'Đơn vị soạn thảo' : result.don_vi}
            </Typography>
            <Typography variant="small" className="border border-gray-300 rounded px-2 py-1">
              {!result ? 'Văn bản số' : result.so_van_ban}
            </Typography>
          </div>
        </div>
        <div className='w-fit flex flex-col items-center justify-center'>
          <Typography variant="h5">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
          <Typography>Độc lập - Tự do - Hạnh phúc</Typography>
          <Typography variant="small" className="mt-3 w-fit border border-gray-300 rounded px-2 py-1">
            {!result ? 'Thời gian soạn thảo' : convertToDate(result.thoi_gian_dang)}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="p-6 max-w-5xl">
        <div className="border border-gray-300 rounded p-4 max-h-[600px] overflow-auto min-h-96 mx-4">
          <Typography className='font-bold'>Câu hỏi: {!result ? 'Câu hỏi' : result.cau_hoi}</Typography>
          <Typography>Câu trả lời: {!result ? 'Câu trả lời' : result.cau_tra_loi}</Typography>
        </div>

        {/* Hiển thị file PDF */}
        {result && result.fileType === 'pdf' && result.url && (
          <Document file={result.url}>
            <Page pageNumber={1} />
          </Document>
        )}

        {/* Hiển thị file .docx */}
        {result && result.fileType === 'docx' && result.url && (
          <DocViewer
            documents={[{ uri: result.url }]}
            pluginRenderers={DocViewerRenderers}
          />
        )}
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
