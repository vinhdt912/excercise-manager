import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Card,
  List,
  Checkbox,
  Divider,
  Typography,
  Row,
  Col,
  message,
  Spin,
  Modal
} from 'antd';
import { SearchOutlined, DeleteOutlined, PrinterOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getExercises, createExam } from '../../apis';
import { Exercise } from '../../types/excercise';
import { Exam } from '../../types/exam';
import LatexRenderer from '../common/LatexRenderer';
import ExerciseFilters from '../Exercise/ExerciseFilters';
import ExamPrintView from './ExamPrintView';

const { Title, Text } = Typography;
const { TextArea } = Input;

const grades = [6, 7, 8, 9, 10, 11, 12];
const subjects = ["Toán", "Vật lý", "Hóa học", "Ngữ văn", "Lịch sử"];

export default function CreateExamPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [searchParams, setSearchParams] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Fetch exercises
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20, ...searchParams };
      const response = await getExercises(params);
      setExercises(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      message.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [page, searchParams]);

  const handleFilterChange = (filters: any) => {
    setPage(1);
    setSearchParams(filters);
  };

  const handleExerciseSelect = (exercise: Exercise, checked: boolean) => {
    if (checked) {
      setSelectedExercises(prev => [...prev, exercise]);
    } else {
      setSelectedExercises(prev => prev.filter(e => e._id !== exercise._id));
    }
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(prev => prev.filter(e => e._id !== exerciseId));
  };

  const handleSubmit = async (values: any) => {
    if (selectedExercises.length === 0) {
      message.error('Vui lòng chọn ít nhất một bài tập');
      return;
    }

    try {
      setLoading(true);
      const examData: Exam = {
        ...values,
        exercises: selectedExercises.map((exercise, index) => ({
          exerciseId: exercise._id!,
          order: index + 1,
          points: 1 // Default points, can be customized later
        })),
        totalPoints: selectedExercises.length
      };

      await createExam(examData);
      message.success('Tạo đề thi thành công!');
      navigate('/exams'); // Navigate back to exam list
    } catch (error) {
      message.error('Không thể tạo đề thi');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPreview = () => {
    const formValues = form.getFieldsValue();
    
    if (!formValues.examCode) {
      message.error('Vui lòng nhập mã đề thi');
      return;
    }
    if (!formValues.title) {
      message.error('Vui lòng nhập tiêu đề đề thi');
      return;
    }
    if (!formValues.grade) {
      message.error('Vui lòng chọn lớp');
      return;
    }
    if (!formValues.subject) {
      message.error('Vui lòng chọn môn học');
      return;
    }
    if (selectedExercises.length === 0) {
      message.error('Vui lòng chọn ít nhất một bài tập');
      return;
    }
    
    setShowPrintPreview(true);
  };

  const getPreviewExam = (): Exam => {
    const formValues = form.getFieldsValue();
    return {
      examCode: formValues.examCode || 'DE001',
      title: formValues.title || 'Đề thi mẫu',
      grade: formValues.grade || 6,
      subject: formValues.subject || 'Toán',
      duration: formValues.duration || 45,
      totalPoints: selectedExercises.length,
      instructions: formValues.instructions || '',
      exercises: selectedExercises.map((exercise, index) => ({
        exerciseId: exercise,
        order: index + 1,
        points: 1
      }))
    };
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/exams')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại danh sách đề thi
        </Button>
        <Title level={2}>Tạo đề thi mới</Title>
      </div>
      
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={24}>
          {/* Left side - Exercise selection */}
          <Col span={14}>
            {/* Exam basic info */}
            <Card style={{ marginBottom: 16 }}>
              <Title level={4}>Thông tin đề thi</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="examCode" label="Mã đề thi" rules={[{ required: true }]}>
                    <Input placeholder="VD: DE001" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="grade" label="Lớp" rules={[{ required: true }]}>
                    <Select options={grades.map((g) => ({ label: `Lớp ${g}`, value: g }))} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="subject" label="Môn học" rules={[{ required: true }]}>
                    <Select options={subjects.map((s) => ({ label: s, value: s }))} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="title" label="Tiêu đề đề thi" rules={[{ required: true }]}>
                    <Input placeholder="Nhập tiêu đề đề thi" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="duration" label="Thời gian (phút)" rules={[{ required: true }]}>
                    <InputNumber min={1} max={180} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="totalPoints" label="Tổng điểm" rules={[{ required: true }]}>
                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="instructions" label="Hướng dẫn làm bài">
                <TextArea rows={3} placeholder="Nhập hướng dẫn làm bài..." />
              </Form.Item>
            </Card>

            {/* Exercise filters */}
            <Card style={{ marginBottom: 16 }}>
              <Title level={4}>Tìm kiếm bài tập</Title>
              <ExerciseFilters
                onSearch={(search) => handleFilterChange({ search })}
                onFilterChange={handleFilterChange}
                compact={false}
              />
            </Card>

            {/* Exercise list */}
            <Card>
              <Title level={4}>Danh sách bài tập ({total} bài)</Title>
              
              <Spin spinning={loading}>
                <List
                  dataSource={exercises}
                  renderItem={(exercise) => (
                    <List.Item
                      actions={[
                        <Checkbox
                          checked={selectedExercises.some(e => e._id === exercise._id)}
                          onChange={(e) => handleExerciseSelect(exercise, e.target.checked)}
                        >
                          Chọn
                        </Checkbox>
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>{exercise.exerciseCode}</Text>
                            <Text type="secondary">Lớp {exercise.grade} - {exercise.subject}</Text>
                            <Text type="secondary">({exercise.difficulty})</Text>
                          </Space>
                        }
                        description={
                          <div>
                            <LatexRenderer content={exercise.question} />
                            {exercise.tags.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                {exercise.tags.map(tag => (
                                  <Text key={tag} code style={{ marginRight: 8 }}>{tag}</Text>
                                ))}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Spin>
            </Card>
          </Col>

          {/* Right side - Preview */}
          <Col span={10}>
            <Title level={3}>Xem trước đề thi</Title>
            
            <Card>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Bài tập đã chọn ({selectedExercises.length} bài)</Text>
              </div>

              {selectedExercises.length === 0 ? (
                <Text type="secondary">Chưa có bài tập nào được chọn</Text>
              ) : (
                <List
                  dataSource={selectedExercises}
                  renderItem={(exercise, index) => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveExercise(exercise._id!)}
                        />
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <Space>
                            <Text strong>Câu {index + 1}:</Text>
                            <Text>{exercise.exerciseCode}</Text>
                          </Space>
                        }
                        description={
                          <div>
                            <LatexRenderer content={exercise.question} />
                            {exercise.isMultipleChoice && exercise.answers && (
                              <div style={{ marginTop: 8 }}>
                                {exercise.answers.map((answer, idx) => (
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
                  )}
                />
              )}
            </Card>

            {/* Action buttons */}
            <Card style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  icon={<PrinterOutlined />}
                  onClick={handlePrintPreview}
                  disabled={selectedExercises.length === 0}
                  style={{ width: '100%' }}
                >
                  Xem trước in
                </Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={() => form.submit()}
                  loading={loading}
                  disabled={selectedExercises.length === 0}
                  style={{ width: '100%' }}
                >
                  Tạo đề thi
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Print Preview Modal */}
      <Modal
        open={showPrintPreview}
        onCancel={() => setShowPrintPreview(false)}
        footer={[
          <Button key="back" onClick={() => setShowPrintPreview(false)}>
            Quay lại
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In đề thi
          </Button>
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}
        title="Xem trước đề thi"
      >
        <ExamPrintView exam={getPreviewExam()} />
      </Modal>
    </div>
  );
} 