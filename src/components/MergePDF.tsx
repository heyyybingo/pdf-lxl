import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { PDFDocument } from "pdf-lib";

const MergePDF: React.FC = () => {
  const [fileList, setFileList] = useState<File[]>([]);

  // 处理文件上传
  const handleUpload = (info: any) => {
    const newFileList = info.fileList.map((file: any) => file.originFileObj);
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
      // @ts-ignore
      const blob = new Blob([mergedPdfBytes.buffer], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "merged.pdf";
      link.click();

      message.success("PDF 合并成功！");
    } catch (error) {
      console.error("合并 PDF 时出错：", error);
      message.error("合并 PDF 失败，请重试！");
    }
  };

  return (
    <div>
      <Upload
        multiple
        accept=".pdf"
        beforeUpload={() => false} // 阻止自动上传
        onChange={handleUpload}
      >
        <Button icon={<UploadOutlined />}>上传 PDF 文件</Button>
      </Upload>
      <Button
        type="primary"
        onClick={mergePDFs}
        disabled={fileList.length < 2}
        style={{ marginTop: 16 }}
      >
        合并 PDF
      </Button>
    </div>
  );
};

export default MergePDF;