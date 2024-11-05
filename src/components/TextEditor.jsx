import { useState, useRef, useCallback, useEffect  } from 'react';
import { Input, Textarea, Button, Select, Option, List, ListItem, Tooltip, Typography, Spinner } from "@material-tailwind/react";
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import exportToWord from '../config/exportToWord';
import { searchCauHoi, searchCauTraLoi } from "../service/apis";
import { debounce } from 'lodash';


  const AutocompleteTextarea = ({ label, value, onChange, suggestions, onSelect, isLoading }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputValue, setInputValue] = useState(value);
  
    const handleInputChange = (e) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange(newValue);
      setShowSuggestions(true);
    };
  
    const handleSuggestionClick = (suggestion) => {
      setInputValue(suggestion);
      setShowSuggestions(false);
      onChange(suggestion);
      onSelect && onSelect(suggestion);
    };

    const handleBlur= () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    }
  
    return (
      <div className="relative">
        <Textarea
            size='lg'
          label={label}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={handleBlur}
        />
        {isLoading && (
          <div className="absolute right-5 top-3">
            <Spinner className="h-4 w-4" />
          </div>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div className="h-96 absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-auto">
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
                   </div>
                 }
               >
                <div
                    key={index}
                    className="cursor-pointer rounded-md text-sm p-2 text-blue-gray-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500"
                    >
                    <div 
                        onClick={() => {
                            if (label.includes("kiến nghị")) {
                                handleSuggestionClick(suggestion.cau_hoi);
                            } else if (label.includes("giải pháp")) {
                                handleSuggestionClick(suggestion.cau_tra_loi);
                            }
                        }}
                        className='line-clamp-3'>
                        {label.includes("kiến nghị") ? suggestion.cau_hoi : label.includes("giải pháp") ? suggestion.cau_tra_loi : null}
                    </div>

                    <div className="absolute left-0 right-0 h-[1px] mt-2 bg-blue-gray-700 opacity-70" style={{ width: '95%', left: '2.5%' }} />
                </div>
                  </Tooltip>
            ))}
          </div>
        )}
      </div>
    );
  };

export default function TextEditor() {
    // Khởi tạo state cho từng trường nhập liệu
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
        recipients: '-Như trên;\nVụ trưởng (để b/c);',
        position: ''
    });
    const [suggestions, setSuggestions] = useState([])
    const [solutions, setSolutions] = useState([])
    const [selected, setSelected] = useState('')
    
    const [value, setValue] = useState("");
    const [isLoadingAnswer, setIsLoadingAnswer] = useState("")
    const [isLoadingSolution, setIsLoadingSolution] = useState("")
    const debouncedSearchCauHoi = useCallback(
        debounce((value) => {
            handleSearchCauHoi(value);
        }, 500),
        []
    );

    const debouncedSearchCauTraLoi = useCallback(
        debounce((value) => {
            handleSearchCauTraLoi(value);
        }, 500),
        []
    );
    useEffect(() => {
        console.log(suggestions); 
    }, [suggestions]);

    const check = () => {
        console.log(suggestions); 
    }
    
    const handleSearchCauHoi = async (searchQuery) => {
        if (searchQuery !== "") {
            const suggestionsList = suggestions.map(suggestion => suggestion.cau_hoi); 
    
            const isInSolution = suggestionsList.some(solution => solution.includes(searchQuery));

            check()
    
            if (!isInSolution) {
                setIsLoadingAnswer(true);
                try {
                    const data = await searchCauHoi(searchQuery);
                    setSuggestions(data.data);
                } catch (e) {
                    console.log(e);
                }
                setIsLoadingAnswer(false);
            } else {
                console.log("searchQuery đã nằm trong suggestions, không gọi API.");
            }
        }
    };
    

    
    const handleSearchCauTraLoi = async (searchQuery) => {
            setIsLoadingSolution(true)
            try {
                const data = await searchCauTraLoi(searchQuery)
                setSolutions(data.data)
                setSelected('')
            } catch (e) {
                console.log(e)
            }
            setIsLoadingSolution(false)
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'recipients') {
            setForm({ 
                ...form, 
                [name]: value.replace(/\r\n/g, '\n')  
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };
    const handleSelectChange = (value) => {
        setForm({ ...form, receivingUnit: value });
        setValue(value);
    };

    
    const addSuggestion = () => {
        setForm({
            ...form,
            suggestions: [...form.suggestions, { id: form.suggestions.length + 1, suggestion: '', solution: '' }],
        });
    };
    
    const docRef = useRef(null);
    
    
    const removeSuggestion = (index) => {
        const newSuggestions = form.suggestions.filter((_, i) => i !== index);
        setForm({ ...form, suggestions: newSuggestions });
    };
    const handleSuggestionChange = (index, field, value) => {
        if (field === "suggestion" && selected === '') {
            debouncedSearchCauHoi.cancel();
            debouncedSearchCauHoi(value);
        } else if (field === "solution" && value !== '') {
            debouncedSearchCauTraLoi(value)
        }
    
        const newSuggestions = [...form.suggestions];
        newSuggestions[index][field] = value;
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
                
                <Textarea size='md' label="Nội dung dẫn nhập" name="introduction" onChange={handleChange} />

                {form.suggestions.map((suggestion, index) => (
                    <div key={suggestion.id} className="space-y-2 flex flex-col">
                        <AutocompleteTextarea
                        label={`Phần kiến nghị ${index + 1}`}
                        value={suggestion.suggestion}
                        onChange={(value) => handleSuggestionChange(index, 'suggestion', value)}
                        suggestions={suggestions}
                        onSelect={(selected) => {
                            setSelected(selected)
                            handleSuggestionChange(index, 'solution', selected);
                        }}
                        isLoading={isLoadingAnswer}
                        />
                        <AutocompleteTextarea
                        label={`Phần giải pháp ${index + 1}`}
                        value={suggestion.solution}
                        onChange={(value) => handleSuggestionChange(index, 'solution', value)}
                        suggestions={solutions}
                        isLoading={isLoadingSolution}
                        />
                        <Button 
                        className='ml-auto' 
                        onClick={() => removeSuggestion(index)} 
                        variant="text" 
                        color="red"
                        >
                        <TrashIcon className='w-4 h-4'/>
                        </Button>
                    </div>
                ))}

                <Button onClick={addSuggestion} variant="outlined" className="w-full mt-2">
                    Thêm cặp kiến nghị và giải pháp
                </Button>
                <Textarea size='md' label="Phần kết" name="conclusion" onChange={handleChange} />
                <div className='flex gap-7'>
                <Textarea size='md' label="Nơi nhận" name="recipients" style={{ whiteSpace: 'pre-line' }} onChange={handleChange} />
                <Textarea size='md' label="Chức vụ" name="position" onChange={handleChange} />
                </div>
            </div>

            <div className="w-[55%] flex flex-col p-4 border rounded-md bg-white space-y-4" ref={docRef}>
            <div className='flex justify-between'>
                <div className='flex flex-col w-fit max-w-[50%]  items-center'>
                    <div className='w-fit text-center'>{form.draftingUnit || 'Đơn vị soạn thảo'}</div>
                    <div className='w-fit text-center'><strong>{form.subjectDetail || ''}</strong></div>
                    <div className="w-36 h-0.5 bg-black mt-1"></div>
                    <div className='w-fit mt-1 text-center'>{form.documentNumber || 'Văn bản số'}</div>
                    <div className='w-fit text-sm text-center'>{form.subject || 'V/v'}</div>
                </div>
                <div className='flex flex-col max-w-[50%] items-center justify-center'>
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
                    <span className='font-bold p-3 mt-3 block border-2 rounded-lg max-h-96 overflow-auto'>
                        {suggestion.suggestion || 'Phần kiến nghị'}
                    </span>
                    <span className='p-3 block border-2 rounded-lg mt-2 max-h-96 overflow-auto'>
                        {suggestion.solution || 'Phần giải pháp'}
                    </span>
                </div>
            ))}
            <div className='p-3 mt-4 border-2 rounded-lg'>
                {form.conclusion || 'Phần kết'}
            </div>
            <div className='flex justify-between'>
            <div className='p-1 mt-4 border-2 rounded-lg text-sm h-fit'>
                {(form.recipients || 'Nơi nhận').split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
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
