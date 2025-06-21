import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Space,
  Table,
  Card,
  Typography,
  Popconfirm,
  message,
  Tag,
  Modal,
  Descriptions,
  List
} from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { getExams, deleteExam } from '../../apis';
import { Exam } from '../../types/exam';
import LatexRenderer from '../common/LatexRenderer';
import ExamPrintView from './ExamPrintView';

const { Title, Text } = Typography;

export default function ExamList() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);
  const [printExam, setPrintExam] = useState<Exam | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchExams = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getExams({ page, limit: pageSize });
      setExams(response.data.data);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: response.data.total
      }));
    } catch (error) {
      message.error('Không thể tải danh sách đề thi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteExam(id);
      message.success('Xóa đề thi thành công');
      fetchExams(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Không thể xóa đề thi');
    }
  };

  const handlePreview = (exam: Exam) => {
    setPreviewExam(exam);
  };

  const handlePrint = (exam: Exam) => {
    setPrintExam(exam);
  };

  const handleCreateExam = () => {
    navigate('/create-exam');
  };

  const columns = [
    {
      title: 'Mã đề thi',
      dataIndex: 'examCode',
      key: 'examCode',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text>{text}</Text>
    },
    {
      title: 'Lớp',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade: number) => <Tag color="blue">Lớp {grade}</Tag>
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => <Tag color="green">{subject}</Tag>
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => <Text>{duration} phút</Text>
    },
    {
      title: 'Số câu',
      key: 'exerciseCount',
      render: (record: Exam) => <Text>{record.exercises.length} câu</Text>
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      render: (points: number) => <Text strong>{points} điểm</Text>
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: Exam) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(record)}
            title="In đề thi"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa đề thi này?"
            onConfirm={() => handleDelete(record._id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateExam}
          >
            Tạo đề thi mới
          </Button>
        </Space>
      </Space>

      <Card>
        <Table
          columns={columns}
          dataSource={exams}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} đề thi`,
            onChange: (page, pageSize) => fetchExams(page, pageSize)
          }}
        />
      </Card>

      {/* Preview Exam Modal */}
      <Modal
        open={!!previewExam}
        onCancel={() => setPreviewExam(null)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => previewExam && handlePrint(previewExam)}>
            In đề thi
          </Button>,
          <Button key="close" onClick={() => setPreviewExam(null)}>
            Đóng
          </Button>
        ]}
        width="80%"
        title="Xem chi tiết đề thi"
      >
        {previewExam && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Mã đề thi">{previewExam.examCode}</Descriptions.Item>
              <Descriptions.Item label="Tiêu đề">{previewExam.title}</Descriptions.Item>
              <Descriptions.Item label="Lớp">Lớp {previewExam.grade}</Descriptions.Item>
              <Descriptions.Item label="Môn học">{previewExam.subject}</Descriptions.Item>
              <Descriptions.Item label="Thời gian">{previewExam.duration} phút</Descriptions.Item>
              <Descriptions.Item label="Tổng điểm">{previewExam.totalPoints} điểm</Descriptions.Item>
            </Descriptions>

            {previewExam.instructions && (
              <Card style={{ marginBottom: 16 }}>
                <Title level={5}>Hướng dẫn làm bài:</Title>
                <Text>{previewExam.instructions}</Text>
              </Card>
            )}

            <Card>
              <Title level={5}>Danh sách câu hỏi:</Title>
              <List
                dataSource={previewExam.exercises}
                renderItem={(examExercise, index) => {
                  const exercise = examExercise.exerciseId as any;
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>Câu {index + 1}:</Text>
                            <Text>{exercise.exerciseCode}</Text>
                            <Text type="secondary">({examExercise.points} điểm)</Text>
                          </Space>
                        }
                        description={
                          <div>
                            <LatexRenderer content={exercise.question} />
                            {exercise.isMultipleChoice && exercise.answers && (
                              <div style={{ marginTop: 8 }}>
                                {exercise.answers.map((answer: any, idx: number) => (
                                  <div key={idx} style={{ marginLeft: 16 }}>
                                    <Text>{String.fromCharCode(65 + idx)}. {answer.text}</Text>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
          </div>
        )}
      </Modal>

      {/* Print Exam Modal */}
      <Modal
        open={!!printExam}
        onCancel={() => setPrintExam(null)}
        footer={[
          <Button key="close" onClick={() => setPrintExam(null)}>
            Đóng
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In đề thi
          </Button>
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}
        title="In đề thi"
      >
        {printExam && <ExamPrintView exam={printExam} />}
      </Modal>
    </div>
  );
} 