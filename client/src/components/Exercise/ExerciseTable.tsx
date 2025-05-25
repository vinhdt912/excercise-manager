import { Table, Space, Button, Popconfirm, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Exercise } from "../../types/excercise";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

type Props = {
  data: Exercise[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
};

const ExerciseTable = ({
  data,
  total,
  page,
  onPageChange,
  onEdit,
  onDelete,
  onPreview,
}: Props) => {
  const columns: ColumnsType<Exercise> = [
    {
      title: "Mã",
      dataIndex: "exerciseCode",
      key: "exerciseCode",
      width: 100,
      sorter: (a, b) => a.exerciseCode.localeCompare(b.exerciseCode),
    },
    // {
    //   title: "Tên",
    //   dataIndex: "title",
    //   key: "title",
    //   width: 200,
    // },
    {
      title: "Lớp",
      dataIndex: "grade",
      key: "grade",
      width: 80,
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      width: 120,
    },
    {
      title: "Độ khó",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 120,
    },
    {
      title: "Thẻ",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => dayjs(b.createdAt!).diff(dayjs(a.createdAt!), "day"),
      defaultSortOrder: "descend",
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 200,
      render: (_, record) => (
        <Space>
          <EditOutlined onClick={() => onEdit(record._id!)} />
          <EyeOutlined onClick={() => onPreview(record._id!)} />
          <Popconfirm
            title="Xoá bài tập này?"
            onConfirm={() => onDelete(record._id!)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={data}
      pagination={{
        current: page,
        total,
        pageSize: 10,
        showSizeChanger: false,
        onChange: onPageChange,
        position: ["bottomRight"],
      }}
      scroll={{ x: 1000 }}
    />
  );
};

export default ExerciseTable;
