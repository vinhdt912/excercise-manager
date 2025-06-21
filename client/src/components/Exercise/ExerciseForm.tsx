import { Button, Checkbox, Form, Input, Modal, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { Exercise, Answer } from "../../types/excercise";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Exercise) => void;
  initial?: Exercise;
}

const INITIAL_VALUES: Exercise = {
  isMultipleChoice: true,
  answers: [],
  difficulty: "Dễ",
  exerciseCode: "",
  grade: 6,
  question: "",
  subject: "",
  tags: [],
};

const grades = [6, 7, 8, 9, 10, 11, 12];
const difficulties = ["Dễ", "Bình thường", "Khó"];
const subjects = ["Toán", "Vật lý", "Hóa học", "Ngữ văn", "Lịch sử"];

export default function ExerciseForm({ visible, onClose, onSubmit, initial = INITIAL_VALUES }: Props) {
  const [form] = Form.useForm();
  const [answers, setAnswers] = useState<Answer[]>(
    initial?.answers || [
      { text: "", correct: false },
      { text: "", correct: false },
    ]
  );

  const isMultipleChoice = Form.useWatch("isMultipleChoice", form);

  const handleAnswerChange = (index: number, field: keyof Answer, value: any) => {
    const newAnswers = [...answers];
    if (field === "correct") {
      newAnswers.forEach((a, i) => (a.correct = i === index)); // only one true
    } else {
      newAnswers[index][field] = value;
    }
    setAnswers(newAnswers);
  };

  const onFinish = (values: any) => {
    const data: Exercise = {
      ...values,
      answers: isMultipleChoice ? answers : [],
    };
    if (initial?._id) data._id = initial._id;
    onSubmit(data);
    form.resetFields();
    setAnswers([
      { text: "", correct: false },
      { text: "", correct: false },
    ]);
  };

  useEffect(() => {
    if (initial) form.setFieldsValue(initial);
    else form.resetFields();
  }, [form, initial]);

  return (
    <Modal open={visible} title={initial ? "Sửa bài tập" : "Tạo bài tập"} onCancel={onClose} onOk={() => form.submit()}>
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initial}>
        <Form.Item name="exerciseCode" label="Mã bài tập" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="grade" label="Lớp" rules={[{ required: true }]}>
          <Select options={grades.map((g) => ({ label: `Lớp ${g}`, value: g }))} />
        </Form.Item>
        <Form.Item name="subject" label="Môn học" rules={[{ required: true }]}>
          <Select options={subjects.map((s) => ({ label: s, value: s }))} />
        </Form.Item>
        <Form.Item name="difficulty" label="Độ khó" rules={[{ required: true }]}>
          <Select options={difficulties.map((d) => ({ label: d, value: d }))} />
        </Form.Item>
        <Form.Item name="isMultipleChoice" valuePropName="checked">
          <Checkbox>Có phải câu hỏi trắc nghiệm?</Checkbox>
        </Form.Item>
        {isMultipleChoice && (
          <>
            <div style={{ marginBottom: 10 }}>Đáp án:</div>
            {answers.map((a, i) => (
              <Space key={i} style={{ marginBottom: 5 }} align="start">
                <Input
                  value={a.text}
                  placeholder={`Đáp án ${i + 1}`}
                  onChange={(e) => handleAnswerChange(i, "text", e.target.value)}
                />
                <Checkbox checked={a.correct} onChange={(e) => handleAnswerChange(i, "correct", e.target.checked)}>
                  Đúng
                </Checkbox>
              </Space>
            ))}
            <Button onClick={() => setAnswers([...answers, { text: "", correct: false }])}>+ Thêm đáp án</Button>
          </>
        )}
        <Form.Item name="tags" label="Thẻ">
          <Select mode="tags" style={{ width: "100%" }} placeholder="Nhập các thẻ..." />
        </Form.Item>
        <Form.Item name="question" label="Câu hỏi" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
