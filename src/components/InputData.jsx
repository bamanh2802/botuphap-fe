import React, { useState, useEffect } from 'react';
import { Select, Option } from '@material-tailwind/react';
import { Input, Textarea } from '@material-tailwind/react';
import { Button } from '@material-tailwind/react';

const DocumentInputForm = () => {
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'upload'
  const [time, setTime] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [issueGroup, setIssueGroup] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submittedDocuments, setSubmittedDocuments] = useState([]);

  const issueGroups = [
    "Vụ Các vấn đề chung về xây dựng pháp luật (VĐCXDPL)",
    "Phòng Chính sách pháp luật (CSPL)",
    "Phòng Công tác xây dựng pháp luật (XDPL)",
    "Phòng Công tác pháp chế (CTPC)",
    "Phòng Đánh giá tác động thủ tục hành chính và Tổng hợp",
    "Vụ Pháp luật hình sự - hành chính",
    "Vụ Pháp luật dân sự - kinh tế",
    "Vụ Pháp luật quốc tế",
    "Vụ Tổ chức cán bộ",
    "Vụ Hợp tác quốc tế",
    "Vụ Con nuôi",
    "Thanh tra Bộ",
    "Văn phòng Bộ (VP)",
    "Tổng cục Thi hành án dân sự (TCTHADS)",
    "Cục Phổ biến, giáo dục pháp luật (PBGDPL)",
    "Cục Kiểm tra văn bản quy phạm pháp luật (KtrVB)",
    "Cục Quản lý xử lý vi phạm hành chính và theo dõi thi hành pháp luật (QLXLVPHC&TDTHPL)",
    "Cục Hộ tịch, quốc tịch, chứng thực (HTQTCT)",
    "Cục Trợ giúp pháp lý (TGPL)",
    "Cục Đăng ký quốc gia giao dịch bảo đảm (CĐKGDBĐ)",
    "Cục Bồi thường nhà nước (BTNN)",
    "Cục Bổ trợ tư pháp (BTTP)",
    "Cục Kế hoạch - Tài chính (KHTC)",
    "Cục Công nghệ thông tin (CNTT)",
    "Trung tâm Lý lịch tư pháp quốc gia (TTLLTPQG)",
  ];

  useEffect(() => {
    // Load uploaded files from localStorage
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    setUploadedFiles(storedFiles);
    
    // Load submitted documents from localStorage
    const storedDocuments = JSON.parse(localStorage.getItem('submittedDocuments')) || [];
    setSubmittedDocuments(storedDocuments);
  }, []);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...uploadedFiles, ...files.map(file => file.name)];
    
    // Update state and localStorage
    setUploadedFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent form submission if uploading and no files are present
    if (inputMethod === 'upload' && uploadedFiles.length === 0) {
      alert('Vui lòng tải lên ít nhất một file.');
      return;
    }

    // Prevent form submission if issue group is not selected
    if (!issueGroup) {
      alert('Vui lòng chọn nhóm vấn đề.');
      return;
    }

    // Create document object to store
    const documentData = { 
      time, 
      documentType: inputMethod === 'manual' ? documentType : null, 
      documentName: inputMethod === 'manual' ? documentName : null, 
      responseContent, 
      issueGroup, 
      method: inputMethod,
      files: inputMethod === 'upload' ? uploadedFiles : []
    };

    // Store document data in localStorage
    const updatedDocuments = [...submittedDocuments, documentData];
    setSubmittedDocuments(updatedDocuments);
    localStorage.setItem('submittedDocuments', JSON.stringify(updatedDocuments));

    // Optionally, you can clear the form
    setTime('');
    setDocumentType('');
    setDocumentName('');
    setResponseContent('');
    setIssueGroup('');
    setUploadedFiles([]);
  };

  return (
    <div className='mt-8 w-full flex justify-center'>
      <div className='w-full max-w-6xl'>
        <form onSubmit={handleSubmit} className="space-y-4">
            <>
            <Select
            label="Nhóm vấn đề"
            value={issueGroup}
            onChange={(value) => setIssueGroup(value)}
            required
          >
            {issueGroups.map((group, index) => (
              <Option key={index} value={group}>
                {group}
              </Option>
            ))}
          </Select>
              <Input
                label="Thời gian"
                type="date"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
              <Input
                label="Loại văn bản"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                required
              />
              <Input
                label="Tên văn bản"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                required
              /> <Input
              label="Người nhập liệu"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
            </>
            <>
              <Input
                type="file"
                onChange={handleFileUpload}
                multiple
              />
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-semibold">Các file đã tải lên:</h4>
                  <ul className="list-disc ml-6">
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>{file}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>

          <Button type="submit" className="w-full">
            Gửi
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-bold">Các tài liệu đã gửi:</h3>
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="border px-4 py-2">STT</th>
                <th className="border px-4 py-2">Nhóm vấn đề</th>
                <th className="border px-4 py-2">Tên tài liệu</th>
                <th className="border px-4 py-2">Thời gian</th>
                <th className="border px-4 py-2">Phương thức nhập liệu</th>
              </tr>
            </thead>
            <tbody>
              {submittedDocuments.map((doc, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{doc.issueGroup}</td>
                  <td className="border px-4 py-2">{doc.documentType ? doc.documentName : doc.files.join(', ')}</td>
                  <td className="border px-4 py-2">{doc.time}</td>
                  <td className="border px-4 py-2">{doc.method}</td>
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
