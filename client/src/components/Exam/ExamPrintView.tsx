import React from 'react';
import { Typography, Divider, Space } from 'antd';
import { Exam } from '../../types/exam';
import LatexRenderer from '../common/LatexRenderer';

const { Title, Text, Paragraph } = Typography;

interface ExamPrintViewProps {
  exam: Exam;
  showAnswers?: boolean;
}

export default function ExamPrintView({ exam, showAnswers = false }: ExamPrintViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="exam-print-view" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Print button - only visible on screen */}
      <div className="no-print" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={handlePrint} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          In đề thi
        </button>
      </div>

      {/* Exam Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Title level={2} style={{ marginBottom: '10px' }}>
          {exam.title}
        </Title>
        <Space direction="vertical" size="small">
          <Text strong>Mã đề thi: {exam.examCode}</Text>
          <Text>Lớp {exam.grade} - Môn {exam.subject}</Text>
          <Text>Thời gian làm bài: {exam.duration} phút</Text>
          <Text>Tổng điểm: {exam.totalPoints} điểm</Text>
        </Space>
      </div>

      <Divider />

      {/* Instructions */}
      {exam.instructions && (
        <div style={{ marginBottom: '20px' }}>
          <Title level={4}>Hướng dẫn làm bài:</Title>
          <Paragraph>{exam.instructions}</Paragraph>
        </div>
      )}

      {/* Student Info */}
      <div style={{ marginBottom: '30px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Họ và tên học sinh: _________________________________</Text>
          <Text>Lớp: _________________</Text>
          <Text>Ngày thi: _________________</Text>
        </Space>
      </div>

      <Divider />

      {/* Questions */}
      <div>
        <Title level={4}>Phần I: Câu hỏi</Title>
        {exam.exercises.map((examExercise, index) => {
          const exercise = examExercise.exerciseId as any;
          return (
            <div key={index} style={{ marginBottom: '25px', pageBreakInside: 'avoid' }}>
              <div style={{ marginBottom: '10px' }}>
                <Text strong>
                  Câu {index + 1}: ({examExercise.points} điểm)
                </Text>
                <Text type="secondary" style={{ marginLeft: '10px' }}>
                  [{exercise.exerciseCode}]
                </Text>
              </div>
              
              <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                <LatexRenderer content={exercise.question} />
              </div>

              {exercise.isMultipleChoice && exercise.answers && (
                <div style={{ marginLeft: '20px' }}>
                  {exercise.answers.map((answer: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>
                      <Text>
                        {String.fromCharCode(65 + idx)}. {answer.text}
                        {showAnswers && answer.correct && (
                          <Text type="success" style={{ marginLeft: '10px' }}>
                            ✓ (Đáp án đúng)
                          </Text>
                        )}
                      </Text>
                    </div>
                  ))}
                </div>
              )}

              {!exercise.isMultipleChoice && (
                <div style={{ marginLeft: '20px' }}>
                  <div style={{ 
                    border: '1px solid #d9d9d9', 
                    minHeight: '100px', 
                    padding: '10px',
                    marginTop: '10px'
                  }}>
                    <Text type="secondary">Chỗ làm bài:</Text>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <Text type="secondary">
          --- Hết ---
        </Text>
      </div>

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .no-print {
              display: none !important;
            }
            .exam-print-view {
              padding: 0 !important;
            }
            @page {
              margin: 1cm;
            }
          }
        `
      }} />
    </div>
  );
} 