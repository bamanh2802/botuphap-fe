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
} from 'docx';
import { saveAs } from 'file-saver';

const exportToWord = async (form) => {
    // Thiết lập lề trang
    const topMargin = convertInchesToTwip(0.79); // 20mm
    const bottomMargin = convertInchesToTwip(0.79); // 20mm
    const leftMarginFront = convertInchesToTwip(1.38); // 35mm
    const rightMarginFront = convertInchesToTwip(0.79); // 20mm
    const leftMarginBack = convertInchesToTwip(0.59); // 15mm
    const rightMarginBack = convertInchesToTwip(1.38); // 35mm

    // Tạo các đoạn cho từng phần
    const paragraphs = [];

    // Quốc hiệu
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                size: 26, 
                bold: true,
                break: 1,
            }),
            new TextRun({
                text: "Độc lập - Tự do - Hạnh phúc",
                size: 28,
                bold: true,
                break: 1,
            }),
            new TextRun({
                text: "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
                break: 1,
            }),
        ],
        alignment: AlignmentType.CENTER,
    }));

    // Thông tin cơ quan
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: "BỘ TƯ PHÁP",
                size: 26, 
                bold: true,
            }),
            new TextRun({
                text: form.subjectDetail || "VỤ CÁC VẤN ĐỀ CHUNG",
                size: 26, 
                bold: true,
            }),
        ],
        alignment: AlignmentType.CENTER,
    }));

    // Số và ký hiệu
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: "Số: ",
                size: 26,
            }),
            new TextRun({
                text: form.documentNumber || "664/VĐCXDPL-XDPL",
                size: 26,
            }),
        ],
    }));
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: `V/v ${form.subject || ""}`,
                size: 26,
            }),
        ],
    }));

    // Địa danh và ngày tháng
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: form.draftingDate || "Hà Nội, ngày ... tháng ... năm ...",
                size: 26,
                italics: true,
            }),
        ],
        alignment: AlignmentType.RIGHT,
    }));

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
            line: 360, // 1.5 lines
        },
        indent: {
            firstLine: convertInchesToTwip(0.5), // 1.27cm
        },
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
            line: 360, // 1.5 lines
        },
        indent: {
            firstLine: convertInchesToTwip(0.5), // 1.27cm
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
                    italics: true,
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

    // Kết
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: form.conclusion || '',
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

    // Footer với nơi nhận và chữ ký
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: "Nơi nhận:",
                italics: true,
                size: 26,
            }),
        ],
    }));
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: form.recipients || '',
                size: 26,
            }),
        ],
    }));
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: "KT. VỤ TRƯỞNG",
                bold: true,
                size: 26,
            }),
        ],
        alignment: AlignmentType.CENTER,
    }));
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: "PHÓ VỤ TRƯỞNG",
                bold: true,
                size: 26,
            }),
        ],
        alignment: AlignmentType.CENTER,
    }));
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: "(Đã ký)",
                italics: true,
                size: 26,
            }),
        ],
        alignment: AlignmentType.CENTER,
    }));
    paragraphs.push(new Paragraph({
        children: [
            new TextRun({
                text: form.position || '',
                bold: true,
                size: 26,
            }),
        ],
        alignment: AlignmentType.CENTER,
    }));

    // Tạo tài liệu Word
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
