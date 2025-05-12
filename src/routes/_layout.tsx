import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ConfigProvider, Menu } from "antd";
import { Layout } from "antd";
import { logout } from "../script/checkToken";
import { redirect } from "react-router-dom";

export const Route = createFileRoute("/_layout")({
  beforeLoad: ()=>{
    if(!localStorage.getItem("access_token")){
      throw redirect("/login")
    }
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    
    return {
      page: context.page,
      setPage: context.setPage,
      setTargetedUser: context.setTargetedUser
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { page, setPage, setTargetedUser } = Route.useLoaderData();
  const { Content, Sider } = Layout;

  const sidebar = [
    { key: 0, label: "Home" },
    { key: 1, label: "User" },
    { key: 2, label: "Messages" },
    { key: 3, label: "Logout" },
  ];

  return (
    <section className="dashboard-section">
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              lightSiderBg: "#E3F8FF",
            },
          },
        }}
      >
        <Layout style={{ backgroundColor: "transparent" }}>
          <Sider
            theme="light"
            style={{ borderRadius: "8px 0 0 8px" }}
            width="20%"
          >
            <Menu
              mode="inline"
              selectedKeys={[String(page)]}
              items={sidebar}
              onClick={({ key }) => {
                if (key === "3") {
                  logout();
                } else if (key === "1") {
                  setPage(1)
                  setTargetedUser(Number(localStorage.getItem("user_id")))
                  navigate({ to: "/dashboard/user" });
                } else if (key === "0") {
                  setPage(0)
                  setTargetedUser(Number(localStorage.getItem("user_id")))
                  navigate({ to: "/dashboard" });
                } else if (key === "2") {
                  setPage(2)
                  setTargetedUser(Number(localStorage.getItem("user_id")))
                  navigate({ to: "/dashboard/messages" });
                }
              }}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "20px",
                borderRadius: "8px 0 0 8px",
                padding: "0px 20px",
              }}
            />
          </Sider>
          <Content
            style={{
              backgroundColor: "#FFD3B6",
              borderRadius: "0 8px 8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
        {page}
      </ConfigProvider>
    </section>
  );
}
