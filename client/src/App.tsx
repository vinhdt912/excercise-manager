// import { Layout, Tree } from "antd";
// import ExerciseList from "./components/Exercise/ExerciseList";

// const { Sider, Content } = Layout;

// const treeData = [
//   {
//     title: "Lớp 6",
//     key: "6",
//     children: [
//       { title: "Toán", key: "6-Toán" },
//       { title: "Lý", key: "6-Lý" },
//     ],
//   },
//   {
//     title: "Lớp 7",
//     key: "7",
//     children: [
//       { title: "Toán", key: "7-Toán" },
//       { title: "Hóa", key: "7-Hóa" },
//     ],
//   },
// ];

// export default function App() {
//   return (
//     <Layout style={{ height: "100vh" }}>
//       <Content style={{ padding: 24 }}>
//         <ExerciseList />
//       </Content>
//     </Layout>
//   );
// }

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, ConfigProvider, Layout, Menu, theme } from "antd";
import ExerciseList from "./components/Exercise/ExerciseList";
import ExamList from "./components/Exam/ExamList";
import CreateExamPage from "./components/Exam/CreateExamPage";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Quản lý bài tập", "exercises", <BookOutlined />),
  getItem("Quản lý đề thi", "exams", <FileOutlined />),
  getItem("Tạo đề thi", "create-exam", <PlusOutlined />),
];

// Component để xử lý navigation
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Xác định key hiện tại dựa trên path
  const getCurrentKey = () => {
    const path = location.pathname;
    if (path === "/exercises") return "exercises";
    if (path === "/exams") return "exams";
    if (path === "/create-exam") return "create-exam";
    return "exercises"; // default
  };

  const handleMenuSelect = ({ key }: { key: string }) => {
    switch (key) {
      case "exercises":
        navigate("/exercises");
        break;
      case "exams":
        navigate("/exams");
        break;
      case "create-exam":
        navigate("/create-exam");
        break;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="demo-logo-vertical"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          <img
            src={"https://partner.flyer.us/static/images/new-icon.png"}
            style={{ width: "50%", height: "50%", margin: "0 auto" }}
            alt="logo"
          />
        </div>
        <Menu 
          defaultSelectedKeys={["exercises"]} 
          mode="inline" 
          items={items}
          selectedKeys={[getCurrentKey()]}
          onSelect={handleMenuSelect}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content
          style={{
            padding: 0,
            margin: 0,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={<ExerciseList />} />
            <Route path="/exercises" element={<ExerciseList />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/create-exam" element={<CreateExamPage />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Hệ thống quản lý đề thi ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "rgb(149 93 203)",
          colorBgContainer: "rgba(249, 250, 251, 0.72)",
          // colorBgBase: "rgb(243 232 255)",
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
};

export default App;
