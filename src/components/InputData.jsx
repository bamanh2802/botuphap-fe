import React, { useState, useEffect } from 'react';
import { Input } from '@material-tailwind/react';
import { Button, Spinner, Alert } from '@material-tailwind/react';
import { uploadFile } from '../service/apis';

const DocumentInputForm = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submittedDocuments, setSubmittedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    setUploadedFiles(storedFiles);

    const storedDocuments = JSON.parse(localStorage.getItem('submittedDocuments')) || [];
    setSubmittedDocuments(storedDocuments);
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const docxFiles = files.filter(file => file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    if (docxFiles.length !== files.length) {
      alert('Chỉ chấp nhận các tệp .docx');
      return;
    }

    const updatedFiles = [...uploadedFiles, ...docxFiles];
    setUploadedFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles.map(file => file.name)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      alert('Vui lòng tải lên ít nhất một file .docx.');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null); 

    try {
      console.log(uploadedFiles)
      await uploadFile(uploadedFiles);
      
      const documentData = { 
        files: uploadedFiles.map(file => file.name),
        time: new Date().toLocaleString(),
      };
      const updatedDocuments = [...submittedDocuments, documentData];
      setSubmittedDocuments(updatedDocuments);
      localStorage.setItem('submittedDocuments', JSON.stringify(updatedDocuments));

      setUploadedFiles([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); 
    } catch (error) {
      setError('Đã xảy ra lỗi trong quá trình tải lên. Vui lòng thử lại.'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-8 w-full flex justify-center'>
      <div className='w-full max-w-6xl'>
        <form onSubmit={handleSubmit} className="space-y-4">
          <>
            <Input
              type="file"
              onChange={handleFileUpload}
              multiple
              accept=".docx"
            />
            {uploadedFiles.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold">Các file đã tải lên:</h4>
                <ul className="list-disc ml-6">
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </>

          <Button type="submit" className="w-full" loading={loading} disabled={loading}>
            {loading ? 'Loading' : 'Gửi'}
          </Button>
          {success && (
            <Alert color="green" className="mt-4">
              Tải lên thành công!
            </Alert>
          )}
          {error && (
            <Alert color="red" className="mt-4">
              {error}
            </Alert>
          )}
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-bold">Các tài liệu đã gửi:</h3>
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="border px-4 py-2">STT</th>
                <th className="border px-4 py-2">Tên tài liệu</th>
                <th className="border px-4 py-2">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {submittedDocuments.map((doc, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{doc.files.join(', ')}</td>
                  <td className="border px-4 py-2">{doc.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentInputForm;
