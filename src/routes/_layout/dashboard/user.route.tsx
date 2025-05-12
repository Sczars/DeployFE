import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Descriptions } from "antd";
import { getUsers } from "../../../script/checkToken";

export const Route = createFileRoute("/_layout/dashboard/user")({
  component: Detail,
  loader: async ({ context }) => {
    const res = await getUsers(context.targetedUser);

    return {
      data: res,
      setPage: context.setPage,
    };
  },
});

export default function Detail() {
  const navigate = useNavigate();
  const { data, setPage } = Route.useLoaderData();

  if (!data) {
    return <div>Loading user data...</div>;
  }
  return (
    <Descriptions
      title={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>User Info</h1>
          <Button
            color="orange"
            variant="outlined"
            onClick={async () => {
              setPage(2);
              navigate({ to: "/dashboard/messages", replace: true });
            }}
          >
            Check Messages
          </Button>
        </div>
      }
      bordered
      column={2}
      style={{
        backgroundColor: "#f9f9f9",
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Descriptions.Item label="Username" span={2}>
        {data.username}
      </Descriptions.Item>
      <Descriptions.Item label="Email" span={2}>
        {data.email}
      </Descriptions.Item>
      <Descriptions.Item label="Created At" span={2}>
        {new Date(data?.createdAt || "").toLocaleString()}
      </Descriptions.Item>

      <Descriptions.Item label="Role">
        {data.role ? "Admin" : "User"}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        {data.isActive ? "Normal" : "Banned"}
      </Descriptions.Item>
    </Descriptions>
  );
}
