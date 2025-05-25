import { Drawer, Typography, List, Tag } from "antd";
import LatexRenderer from "../common/LatexRenderer";
import { Exercise } from "../../types/excercise";

type Props = {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
};

export default function ExercisePreview({ visible, exercise, onClose }: Props) {
  if (!exercise) return null;

  return (
    <Drawer
      open={visible}
      title={`Xem trước bài tập: ${exercise.exerciseCode}`}
      placement="right"
      width={600}
      onClose={onClose}
    >
      <Typography.Title level={4}>Mã: {exercise.exerciseCode}</Typography.Title>
      <Typography.Paragraph>
        <strong>Lớp:</strong> {exercise.grade} | <strong>Môn:</strong>{" "}
        {exercise.subject} | <strong>Độ khó:</strong> {exercise.difficulty}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Thẻ:</strong>{" "}
        {exercise.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Typography.Paragraph>

      <Typography.Title level={5}>Câu hỏi</Typography.Title>
      <LatexRenderer content={exercise.question} />

      {exercise.isMultipleChoice && (
        <>
          <Typography.Title level={5}>Đáp án</Typography.Title>
          <List
            dataSource={exercise.answers}
            renderItem={(ans, index) => (
              <List.Item>
                <List.Item.Meta
                  title={`Đáp án ${String.fromCharCode(65 + index)} ${
                    ans.correct ? "(✔ Đúng)" : ""
                  }`}
                  description={<LatexRenderer content={ans.text} />}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </Drawer>
  );
}
