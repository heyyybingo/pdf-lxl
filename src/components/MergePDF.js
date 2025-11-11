import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { PDFDocument } from "pdf-lib";
const MergePDF = () => {
    const [fileList, setFileList] = useState([]);
    // 处理文件上传
    const handleUpload = (info) => {
        const newFileList = info.fileList.map((file) => file.originFileObj);
        setFileList(newFileList);
    };
    // 合并 PDF 文件
    const mergePDFs = async () => {
        if (fileList.length < 2) {
            message.warning("请至少上传两个 PDF 文件进行合并！");
            return;
        }
        try {
            const mergedPdf = await PDFDocument.create();
            for (const file of fileList) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            // 创建下载链接
            const blob = new Blob([mergedPdfBytes.buffer], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "merged.pdf";
            link.click();
            message.success("PDF 合并成功！");
        }
        catch (error) {
            console.error("合并 PDF 时出错：", error);
            message.error("合并 PDF 失败，请重试！");
        }
    };
    return (_jsxs("div", { children: [_jsx(Upload, { multiple: true, accept: ".pdf", beforeUpload: () => false, onChange: handleUpload, children: _jsx(Button, { icon: _jsx(UploadOutlined, {}), children: "\u4E0A\u4F20 PDF \u6587\u4EF6" }) }), _jsx(Button, { type: "primary", onClick: mergePDFs, disabled: fileList.length < 2, style: { marginTop: 16 }, children: "\u5408\u5E76 PDF" })] }));
};
export default MergePDF;
