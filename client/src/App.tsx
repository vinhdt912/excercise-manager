import { Layout, Tree } from "antd";
import ExerciseList from "./components/Exercise/ExerciseList";

const { Sider, Content } = Layout;

const treeData = [
  {
    title: "Lớp 6",
    key: "6",
    children: [
      { title: "Toán", key: "6-Toán" },
      { title: "Lý", key: "6-Lý" },
    ],
  },
  {
    title: "Lớp 7",
    key: "7",
    children: [
      { title: "Toán", key: "7-Toán" },
      { title: "Hóa", key: "7-Hóa" },
    ],
  },
];

export default function App() {
  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ padding: 24 }}>
        <ExerciseList />
      </Content>
    </Layout>
  );
}
