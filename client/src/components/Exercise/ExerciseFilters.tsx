import { Input, Select, DatePicker, Space } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const gradeOptions = [6, 7, 8, 9, 10, 11, 12].map((i) => ({
  label: `Lớp ${i}`,
  value: i,
}));
const subjectOptions = ["Toán", "Lý", "Hóa", "Văn", "Sử"].map((s) => ({
  label: s,
  value: s,
}));
const difficultyOptions = ["Dễ", "Bình thường", "Khó"].map((d) => ({
  label: d,
  value: d,
}));

type Props = {
  onSearch: (value: string) => void;
  onFilterChange: (filters: any) => void;
};

const ExerciseFilters = ({ onSearch, onFilterChange }: Props) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space wrap>
        <Input.Search
          placeholder="Tìm theo mã, tên, câu hỏi..."
          enterButton
          allowClear
          onSearch={onSearch}
          style={{ width: 400 }}
        />
        <Select
          placeholder="Lớp"
          allowClear
          options={gradeOptions}
          onChange={(val) => onFilterChange({ grade: val })}
          style={{ width: 120 }}
        />
        <Select
          placeholder="Môn học"
          allowClear
          options={subjectOptions}
          onChange={(val) => onFilterChange({ subject: val })}
          style={{ width: 150 }}
        />
        <Select
          placeholder="Độ khó"
          allowClear
          options={difficultyOptions}
          onChange={(val) => onFilterChange({ difficulty: val })}
          style={{ width: 150 }}
        />
        <Select
          mode="tags"
          placeholder="Thẻ"
          allowClear
          onChange={(val) => onFilterChange({ tags: val })}
          style={{ width: 200 }}
        />
        <RangePicker
          onChange={(dates) =>
            onFilterChange({
              dateRange: dates
                ? [dates[0]?.toISOString(), dates[1]?.toISOString()]
                : undefined,
            })
          }
        />
      </Space>
    </Space>
  );
};

export default ExerciseFilters;
