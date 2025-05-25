import { Button, Space } from "antd";
import { useEffect, useState } from "react";
import {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseById,
} from "../../apis";
import { Exercise } from "../../types/excercise";
import ExerciseForm from "./ExerciseForm";
import ExerciseTable from "./ExerciseTable";
import ExerciseFilters from "./ExerciseFilters";
import ExercisePreview from "./ExercisePreview";

export default function ExerciseList() {
  const [data, setData] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewing, setPreviewing] = useState<Exercise | null>(null);

  const fetch = async () => {
    const params = { page, search, ...filters };
    if (filters.dateRange) {
      params.startDate = filters.dateRange[0];
      params.endDate = filters.dateRange[1];
    }
    try {
      const res = await getExercises(params);
      setData(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Không thể lấy bài tập:", error);
    }
  };

  useEffect(() => {
    fetch();
  }, [page, search, filters]);

  const handleFilterChange = (changed: any) => {
    setPage(1);
    setFilters((prev: any) => ({ ...prev, ...changed }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExercise(id);
      fetch();
    } catch (error) {
      console.error("Không thể xoá bài tập:", error);
    }
  };

  const handleSubmit = async (ex: Exercise) => {
    try {
      if (editing) await updateExercise(editing._id!, ex);
      else await createExercise(ex);
      setShowForm(false);
      setEditing(null);
      fetch();
    } catch (error) {
      console.error("Không thể tạo/cập nhật bài tập:", error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await getExerciseById(id);
      const exercise = response.data;
      setEditing(exercise);
      setShowForm(true);
    } catch (error) {
      console.error("Không thể lấy bài tập:", error);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      const response = await getExerciseById(id);
      const exercise = response.data;
      setPreviewing(exercise);
    } catch (error) {
      console.error("Không thể lấy bài tập:", error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleClosePreview = () => {
    setPreviewing(null);
  };

  return (
    <>
      <Space style={{ marginBottom: 16, width: "100%" }} direction="vertical">
        <Space>
          <Button type="primary" onClick={() => setShowForm(true)}>
            + Tạo bài tập
          </Button>
        </Space>

        <ExerciseFilters
          onSearch={setSearch}
          onFilterChange={handleFilterChange}
        />
      </Space>

      <ExerciseTable
        data={data}
        total={total}
        page={page}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      <ExerciseForm
        visible={showForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initial={editing || undefined}
      />

      <ExercisePreview
        visible={!!previewing}
        exercise={previewing}
        onClose={handleClosePreview}
      />
    </>
  );
}
