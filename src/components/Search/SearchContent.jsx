import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button
} from "@material-tailwind/react";
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import API_PATH from '../../service/API_PATH';

export default function SearchContent(props) {
  const { result } = props;
  const [documents, setDocuments] = useState([]);
  const [canRenderDoc, setCanRenderDoc] = useState(false);
  const [currentFilename, setCurrentFilename] = useState('');
  
  function convertToDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return null;
    }
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  // Reset states when filename changes
  useEffect(() => {
    if (result?.filename !== currentFilename) {
      setCanRenderDoc(false);
      setDocuments([]);
      setCurrentFilename(result?.filename || '');
    }
  }, [result?.filename, currentFilename]);

  useEffect(() => {
    let mounted = true;

    const loadDocument = async () => {
      if (result?.filename) {
        try {
          const fileUrl = `${API_PATH}/static/${encodeURIComponent(result.filename)}`;
          const response = await fetch(fileUrl, { method: 'HEAD' });
          
          if (!mounted) return;

          if (response.ok) {
            setDocuments([{ uri: fileUrl }]);
          } else {
            console.error('File not accessible:', response.status);
            setDocuments([]);
            setCanRenderDoc(false);
          }
        } catch (error) {
          console.error('Error checking document:', error);
          if (mounted) {
            setDocuments([]);
            setCanRenderDoc(false);
          }
        }
      }
    };

    loadDocument();

    return () => {
      mounted = false;
    };
  }, [result?.filename]);

  const CardContent = () => (
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
        <div className="w-fit flex flex-col items-center justify-center">
          <Typography variant="h5">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
          <Typography>Độc lập - Tự do - Hạnh phúc</Typography>
          <Typography variant="small" className="mt-3 w-fit border border-gray-300 rounded px-2 py-1">
            {!result ? 'Thời gian soạn thảo' : convertToDate(result.thoi_gian_dang)}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="p-6 max-w-5xl">
        <div className="border flex flex-col justify-center items-center border-gray-300 rounded p-4 max-h-[400px] overflow-auto min-h-96 mx-4">
          <Typography className="font-bold">Câu hỏi: {!result ? 'Câu hỏi' : result.cau_hoi}</Typography>
          <Typography>Câu trả lời: {!result ? 'Câu trả lời' : result.cau_tra_loi}</Typography>
        </div>
      </CardBody>
      {result?.filename && (
        <CardFooter className="pt-0 flex justify-end">
          <Button
            size="sm"
            variant="outlined"
            color="blue"
            ripple={true}
            className="flex items-center gap-2"
            onClick={() => window.open(`${API_PATH}/static/${encodeURIComponent(result.filename)}`, '_blank')}
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
          {documents.length > 0 && (
            <Button
              size="sm"
              variant="outlined"
              color="green"
              ripple={true}
              className="flex items-center gap-2 ml-2"
              onClick={() => setCanRenderDoc(true)}
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
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Xem file
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );

  // Nếu đang render doc và có documents
  if (canRenderDoc && documents.length > 0) {
    try {
      return (
        <>
          <div className="mb-4">
            <Button
              size="sm"
              variant="outlined"
              color="blue"
              ripple={true}
              className="flex items-center gap-2"
              onClick={() => setCanRenderDoc(false)}
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
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
              Quay lại
            </Button>
          </div>
          <div className="w-full">
            <DocViewer
              documents={documents}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: false,
                  retainURLParams: false
                }
              }}
              style={{ height: 800 }}
              onError={() => {
                console.error('DocViewer error');
                setCanRenderDoc(false);
              }}
            />
          </div>
        </>
      );
    } catch (error) {
      console.error('Error rendering DocViewer:', error);
      setCanRenderDoc(false);
    }
  }

  return <CardContent />;
}