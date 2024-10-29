import { useState, useRef  } from 'react';
import { Input, Textarea, Button, Select, Option } from "@material-tailwind/react";
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import exportToWord from '../config/exportToWord';

export default function TextEditor() {
    // Khởi tạo state cho từng trường nhập liệu
    const [form, setForm] = useState({
        draftingUnit: '',
        documentNumber: '',
        subject: '',
        subjectDetail: '',
        draftingDate: '',
        receivingUnit: '',
        introduction: '',
        suggestions: [{ id: 1, suggestion: '', solution: '' }],
        conclusion: '',
        recipients: '',
        position: ''
    });

    const selectUnit = [
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
        "Trung tâm Lý lịch tư pháp quốc gia (TTLLTPQG)"
    ];

    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState("")

    // Hàm xử lý thay đổi giá trị trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSelectChange = (value) => {
        setForm({ ...form, receivingUnit: value });
        setValue(value);
    };

    // Hàm xử lý thay đổi kiến nghị và giải pháp
    const handleSuggestionChange = (index, field, value) => {
        const newSuggestions = [...form.suggestions];
        newSuggestions[index][field] = value;
        setForm({ ...form, suggestions: newSuggestions });
    };

    // Hàm thêm cặp kiến nghị và giải pháp
    const addSuggestion = () => {
        setForm({
            ...form,
            suggestions: [...form.suggestions, { id: form.suggestions.length + 1, suggestion: '', solution: '' }],
        });
    };

    const docRef = useRef(null);


    // Hàm xóa cặp kiến nghị và giải pháp
    const removeSuggestion = (index) => {
        const newSuggestions = form.suggestions.filter((_, i) => i !== index);
        setForm({ ...form, suggestions: newSuggestions });
    };

    return (
        <div className="flex flex-col md:flex-row p-1 gap-4 w-full overflow-auto h-full">
            {/* Form nhập liệu bên trái */}
            <div className="w-[45%] space-y-4 border-blue-100 p-6">
                <h2 className="text-xl font-bold">Soạn văn bản</h2>
                <div className='flex justify-between'>
                    <div className='flex flex-col justify-end w-full max-w-24 gap-1'>
                        <Input label="Đơn vị soạn thảo" name="draftingUnit" onChange={handleChange} />
                        <Input label="Vụ việc" name="subjectDetail" onChange={handleChange} />

                        <Input label="Văn bản số" name="documentNumber" onChange={handleChange} />
                        <Input label="V/v" name="subject" onChange={handleChange} />
                    </div>
                    <div className='mt-auto'>
                        <Input label="Thời gian soạn thảo" name="draftingDate" onChange={handleChange} />
                    </div>
                </div>
                <div className='w-full'>
                    <Select label="Đơn vị nhận" 
                        value={value}
                        onChange={(val) => handleSelectChange(val)}>
                        {
                            selectUnit.map((unit, index) => (
                                <Option 
                                    value={unit}
                                    key={index}>{unit}</Option>
                            ))
                        }
                    </Select>
                </div>
                
                <Textarea label="Nội dung dẫn nhập" name="introduction" onChange={handleChange} />

                {form.suggestions.map((suggestion, index) => (
                    <div key={suggestion.id} className="space-y-2 flex flex-col">
                        <Textarea
                            label={`Phần kiến nghị ${index + 1}`}
                            value={suggestion.suggestion}
                            onChange={(e) => handleSuggestionChange(index, 'suggestion', e.target.value)}
                        />
                        <Textarea
                            label={`Phần giải pháp ${index + 1}`}
                            value={suggestion.solution}
                            onChange={(e) => handleSuggestionChange(index, 'solution', e.target.value)}
                        />
                        <Button className='ml-auto' onClick={() => removeSuggestion(index)} variant="text" color="red">
                            <TrashIcon  className='w-4 h-4'/>
                        </Button>
                    </div>
                ))}

                <Button onClick={addSuggestion} variant="outlined" className="w-full mt-2">
                    Thêm cặp kiến nghị và giải pháp
                </Button>
                <Textarea label="Phần kết" name="conclusion" onChange={handleChange} />
                <div className='flex gap-7'>
                <Textarea size='sm' label="Nơi nhận" name="recipients" onChange={handleChange} />
                <Textarea size='sm' label="Chức vụ" name="position" onChange={handleChange} />
                </div>
            </div>

            <div className="w-[55%] flex flex-col p-4 border rounded-md bg-white space-y-4" ref={docRef}>
            <div className='flex justify-between'>
                <div className='flex flex-col w-fit  items-center'>
                    <div className='w-fit'>{form.draftingUnit || 'Đơn vị soạn thảo'}</div>
                    <div className='w-fit'><strong>{form.subjectDetail || ''}</strong></div>
                    <div className="w-36 h-0.5 bg-black mt-1"></div>
                    <div className='w-fit mt-1'>{form.documentNumber || 'Văn bản số'}</div>
                    <div className='w-fit text-sm'>{form.subject || 'V/v'}</div>
                </div>
                <div className='flex flex-col items-center justify-center'>
                    <h1><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></h1>
                    <h3><strong>Độc lập - Tự do - Hạnh phúc</strong></h3>
                    <div className="w-36 h-0.5 bg-black mt-1"></div>
                    <span>{form.draftingDate || 'Thời gian soạn thảo'}</span>
                </div>
            </div>
            <div className='w-full flex items-center justify-center'>
                Kính gửi: {form.receivingUnit || 'Đơn vị nhận'}
            </div>
            <div className='p-3 mt-4 border-2 rounded-lg'>
                {form.introduction || 'Nội dung dẫn nhập'}
            </div>
            {form.suggestions.map((suggestion, index) => (
                <div key={suggestion.id} className="mb-2">
                    <span className='font-bold p-3 mt-3 block border-2 rounded-lg'>
                        {suggestion.suggestion || 'Phần kiến nghị'}
                    </span>
                    <span className='p-3 block border-2 rounded-lg mt-2'>
                        {suggestion.solution || 'Phần giải pháp'}
                    </span>
                </div>
            ))}
            <div className='p-3 mt-4 border-2 rounded-lg'>
                {form.conclusion || 'Phần kết'}
            </div>
            <div className='flex justify-between'>
                <div className='p-1 mt-4 border-2 rounded-lg text-sm h-fit'>
                    {form.recipients || 'Nơi nhận'}
                </div>
                <div className='mr-6 flex flex-col items-center'>
                    <div className='flex items-center flex-col'>
                        <span className='block font-bold'>KT. VỤ TRƯỞNG</span>
                        <span className='block font-bold'>PHÓ VỤ TRƯỞNG</span>
                    </div>
                    <div>
                        {form.position || 'Chức vụ'}
                    </div>
                </div>
            </div>

            {/* Nút xuất ra file Word */}
            <button 
                onClick={() => exportToWord(form)}
                className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            >
                Xuất ra file Word
            </button>
        </div>
        </div>
    );
}
