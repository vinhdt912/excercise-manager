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
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, ConfigProvider, Layout, Menu, theme } from "antd";
import ExerciseList from "./components/Exercise/ExerciseList";

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
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
          <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <ExerciseList />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
