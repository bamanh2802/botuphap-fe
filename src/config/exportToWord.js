import {
    Document,
    Paragraph,
    TextRun,
    AlignmentType,
    Border,
    WidthType,
    Packer,
    convertInchesToTwip,
    PageOrientation,
    Table,
    TableRow,
    TableCell,
    BorderStyle
    
} from 'docx';
import { saveAs } from 'file-saver';

const exportToWord = async (form) => {
    const topMargin = convertInchesToTwip(0.79);
    const bottomMargin = convertInchesToTwip(0.79);
    const leftMarginFront = convertInchesToTwip(1.18);
    const rightMarginFront = convertInchesToTwip(0.59);

    const paragraphs = [];

    // Thông tin bên trái - Cơ quan
    const headerTable = new Table({
        rows: [
            new TableRow({
                children: [
                    // Cột bên trái
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "BỘ TƯ PHÁP",
                                        size: 24,
                                        bold: false,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                                spacing: {
                                    after: 120, 
                                },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: form.subjectDetail || "VỤ CÁC VẤN ĐỀ CHUNG",
                                        size:26,
                                        bold: true,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾",  // Độ dài đường kẻ phụ thuộc vào số lượng dấu _
                                        size: 26,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                                spacing: {
                                    after: 100,
                                },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Số: ",
                                        size:26,
                                    }),
                                    new TextRun({
                                        text: form.documentNumber || "664/VĐCXDPL-XDPL",
                                        size:26,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                                spacing: {
                                    after:100, 
                                },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `V/v ${form.subject || ""}`,
                                        size:22,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                                spacing: {
                                    after: 120, 
                                },
                            }),
                        ],
                        borders: {
                            top: { style: BorderStyle.NIL, size: 0 },
                            bottom: { style: BorderStyle.NIL, size: 0 },
                            left: { style: BorderStyle.NIL, size: 0 },
                            right: { style: BorderStyle.NIL, size: 0 },
                        },
                        width: {
                            size: 40,
                            type: WidthType.PERCENTAGE,
                        },
                        margins: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        },
                    }),
                    // Cột bên phải
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                                        size:26,
                                        bold: true,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Độc lập - Tự do - Hạnh phúc",
                                        size: 26,
                                        bold: true,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,

                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾",  // Độ dài đường kẻ phụ thuộc vào số lượng dấu _
                                        size: 26,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                                spacing: {
                                    after:200, 
                                },
                            }),
                            
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: form.draftingDate || "Hà Nội, ngày ... tháng ... năm ...",
                                        size: 26,
                                        italics: true,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                        borders: {
                            top: { style: BorderStyle.NIL, size: 0 },
                            bottom: { style: BorderStyle.NIL, size: 0 },
                            left: { style: BorderStyle.NIL, size: 0 },
                            right: { style: BorderStyle.NIL, size: 0 },
                        },
                        width: {
                            size: 60,
                            type: WidthType.PERCENTAGE,
                        },
                        margins: {
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        },
                    }),
                ],
            }),
        ],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        cellSpacing: 0,
        columnSpacing: 0,
        borders: {
            top: { style: BorderStyle.NIL, size: 0 },
            bottom: { style: BorderStyle.NIL, size: 0 },
            left: { style: BorderStyle.NIL, size: 0 },
            right: { style: BorderStyle.NIL, size: 0 },
        },
    });
    
    // Thêm bảng vào phần `children` của section
    paragraphs.push(headerTable);
    
    // Kính gửi
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: `Kính gửi: ${form.receivingUnit || ''}`,
                size: 26,
            }),
        ],
        spacing: {
            before: 400,
            after: 400,
            line: 360,
        },
        indent: {
            firstLine: convertInchesToTwip(0.5),
        },
        alignment: AlignmentType.CENTER,
    }));

    // Nội dung dẫn nhập
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: form.introduction || '',
                size: 26,
            }),
        ],
        spacing: {
            before: 200,
            after: 200,
            line: 360,
        },
        indent: {
            firstLine: convertInchesToTwip(0.5),
        },
    }));

    // Kiến nghị và trả lời
    form.suggestions.forEach((suggestion) => {
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({
                    text: "Kiến nghị: ",
                    bold: true,
                    size: 26,
                }),
                new TextRun({
                    text: suggestion.suggestion || '',
                    bold: true,
                    size: 26,
                }),
            ],
            spacing: {
                before: 200,
                line: 360,
            },
            indent: {
                firstLine: convertInchesToTwip(0.5),
            },
        }));
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({
                    text: "Trả lời: ",
                    bold: true,
                    size: 26,
                }),
                new TextRun({
                    text: suggestion.solution || '',
                    size: 26,
                }),
            ],
            spacing: {
                after: 200,
                line: 360,
            },
            indent: {
                firstLine: convertInchesToTwip(0.5),
            },
        }));
    });

    // Kết luận
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: form.conclusion || '',
                size: 26,
            }),
        ],
        spacing: {
            before: 200,
            after: 400,
            line: 360,
        },
        indent: {
            firstLine: convertInchesToTwip(0.5),
        },
    }));
    const recipientLines = (form.recipients || '').split('\n');

    // Footer với nơi nhận và chữ ký
    const footerTable = new Table({
        rows: [
            new TableRow({
                children: [
                    // Left column
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Nơi nhận:",
                                        italics: true,
                                        size: 26,
                                    }),
                                ],
                            }),
                            ...recipientLines.map(line => 
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: line,
                                            size: 26,
                                        }),
                                    ],
                                })
                            ),
                        ],
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL, size: 0 },
                            bottom: { style: BorderStyle.NIL, size: 0 },
                            left: { style: BorderStyle.NIL, size: 0 },
                            right: { style: BorderStyle.NIL, size: 0 },
                        },
                    }),
                    // Right column
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "KT. VỤ TRƯỞNG",
                                        bold: true,
                                        size: 26,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "PHÓ VỤ TRƯỞNG",
                                        bold: true,
                                        size: 26,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "(Đã ký)",
                                        italics: true,
                                        size: 26,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: form.position || '',
                                        bold: true,
                                        size: 26,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            }),
                        ],
                        width: {
                            size: 50,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL, size: 0 },
                            bottom: { style: BorderStyle.NIL, size: 0 },
                            left: { style: BorderStyle.NIL, size: 0 },
                            right: { style: BorderStyle.NIL, size: 0 },
                        },
                    }),
                ],
            }),
        ],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        borders: {
            top: { style: BorderStyle.NIL, size: 0 },
            bottom: { style: BorderStyle.NIL, size: 0 },
            left: { style: BorderStyle.NIL, size: 0 },
            right: { style: BorderStyle.NIL, size: 0 },
        },
    });

    paragraphs.push(footerTable);


    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: topMargin,
                        bottom: bottomMargin,
                        left: leftMarginFront,
                        right: rightMarginFront,
                    },
                    tableCellSpacing: 0,
                    size: {
                        orientation: PageOrientation.PORTRAIT,
                    },
                },
            },
            children: paragraphs,
        }],
    });

    try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "cong_van.docx");
    } catch (error) {
        console.error('Error generating document:', error);
    }
};

export default exportToWord;