import React, { useState } from "react";
import {
  Upload,
  Button,
  message,
  Space,
  List,
  Layout,
  Typography,
  Flex,
  type UploadFile,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { PDFDocument } from "pdf-lib";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title } = Typography;
type mergedPdfUrlList = {
  name: string;
  data: Blob;
  time: number;
};
const MergePDF: React.FC = () => {
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [mergedPdfUrlList, setMergedPdfUrlList] = useState<mergedPdfUrlList[]>(
    []
  );

  // 处理文件上传
  const handleUpload = (info: any) => {
    //const newFileList = info.fileList.map((file: any) => file.originFileObj);
    setUploadFileList(info.fileList);
    // setUploadFileList(newFileList);
  };

  // 合并 PDF 文件
  const mergePDFs = async () => {
    const fileList = uploadFileList;
    if (fileList.length < 2) {
      message.warning("请至少上传两个 PDF 文件进行合并！");
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of fileList) {
        
        const arrayBuffer = await file.originFileObj?.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer!);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();

      // 创建下载链接
      // @ts-ignore
      const blob = new Blob([mergedPdfBytes.buffer], {
        type: "application/pdf",
      });
      setMergedPdfUrlList([
        ...mergedPdfUrlList,
        {
          name: fileList.map((f) => f.name).join(";"),
          data: blob,
          time: Date.now(),
        },
      ]);
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

  function handleDownload(item: mergedPdfUrlList) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(item.data);
    link.download = `merged_${item.time}.pdf`;
    link.click();
  }
  return (
    <Layout style={{ padding: "24px", background: "#fff" }}>
      <Content style={{ display: "flex", gap: "24px" }}>
        {/* 左侧操作部分 */}
        <div
          style={{
            flex: 1,
            padding: "16px",
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
          }}
        >
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Title level={4}>PDF 合并操作</Title>
            <Button
              style={{ marginTop: 16 }}
              type="link"
              onClick={() => {
                setUploadFileList([]);
              }}
            >
              清空
            </Button>
          </Flex>
          <Upload
            fileList={uploadFileList}
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
            disabled={uploadFileList.length < 2}
            style={{ marginTop: 16 }}
          >
            合并 PDF
          </Button>
        </div>

        {/* 右侧列表部分 */}
        <div
          style={{
            flex: 2,
            padding: "16px",
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
          }}
        >
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Title level={4}>已合并的 PDF 文件</Title>
            <Button
              style={{ marginTop: 16 }}
              type="link"
              onClick={() => {
                setMergedPdfUrlList([]);
              }}
            >
              清空
            </Button>
          </Flex>
          <List
            dataSource={mergedPdfUrlList}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(item)}
                  >
                    下载
                  </Button>,
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setMergedPdfUrlList(
                        mergedPdfUrlList.filter(
                          (pdf, listIndex) => listIndex !== index
                        )
                      );
                    }}
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={dayjs(item.time).format("YYYY-MM-DD HH:mm:ss")}
                  description={item.name}
                />
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default MergePDF;
