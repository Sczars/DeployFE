import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ReactNode, useEffect, useState } from "react";
import { UserInList } from "../../../script/type";
import {
  changeRoleUser,
  deactivateUser,
  getUsersList,
} from "../../../script/checkToken";
import Table, { ColumnsType } from "antd/es/table";
import { Button, ConfigProvider, Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

export const Route = createFileRoute("/_layout/dashboard/")({
  beforeLoad: ({ context }) => {
    context.setTargetedUser(Number(localStorage.getItem("user_id")));
  },
  component: RouteComponent,
  loader: async ({ context }) => {
    return {
      order: context.order,
      setIsChange: context.setIsChange,
      setPage: context.setPage,
      isChange: context.isChange,
      setTargetedUser: context.setTargetedUser,
      targetedUser: context.targetedUser,
    };
  },
});

interface TableData {
  key: number;
  username: ReactNode;
  numMes: number;
  role: string;
  isActive: boolean;
  remove: ReactNode;
}

function RouteComponent() {
  const [data, setData] = useState<UserInList[]>();
  const navigate = useNavigate();
  const { order, setPage, isChange, setTargetedUser, targetedUser } =
    Route.useLoaderData();
  const [newChange, setNewChange] = useState(isChange);

  useEffect(() => {
    getUsersList().then((newData) => {
      Array.isArray(newData) ? setData(newData) : setData([]);
    });
  }, [newChange]);

  const columns: ColumnsType<TableData> = [
    {
      title: "Username",
      dataIndex: "username",
      width: "40%",
      render: (text: string, record) => (
        <span
          onClick={() => {
            setTargetedUser(record.key);
            navigate({ to: "/dashboard/user", replace: true });
            setPage(1);
          }}
        >
          {text}
        </span>
      ),
      onCell: () => ({
        className: "hoverable-cell",
      }),
    },
    {
      title: "No. messages",
      dataIndex: "numMes",
      width: "20%",
      sorter: (a, b) => a.numMes - b.numMes,
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: [
        {
          text: "Admin",
          value: "Admin",
        },
        {
          text: "User",
          value: "User",
        },
      ],
      onFilter: (value, record) => record.role.startsWith(value as string),
      filterMultiple: false,
      render: (text, record) => (
        <Dropdown
          menu={{ items: order, onClick: handleClick(record.key) }}
          trigger={["click"]}
        >
          <span
            className="dropdown"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Space>
              <span className="capitalize">{text}</span>
              <DownOutlined />
            </Space>
          </span>
        </Dropdown>
      ),
      filterSearch: true,
      width: "20%",
    },
    {
      title: "Banned",
      dataIndex: "isActive",
      width: "10%",
      filters: [
        {
          text: "Banned",
          value: false,
        },
        {
          text: "Normal",
          value: true,
        },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (value) => (value ? "Normal" : "Banned"),
      filterMultiple: false,
    },
    {
      title: "Remove",
      dataIndex: "remove",
      width: "10%",
    },
  ];
  let processData: TableData[] = [];

  if (data) {
    processData = data.map((i: UserInList) => ({
      key: i.id,
      username: (
        <>
          <p>{i.username}</p>
          <p>{i.email}</p>
        </>
      ),
      numMes: i.messageCount,
      role: i.role ? "Admin" : "User",
      isActive: i.isActive,
      remove: (
        <Button
          variant="solid"
          color="volcano"
          style={{ width: "100%" }}
          onClick={async () => {
            await deactivateUser(i.id);
            setNewChange((prev) => !prev);
          }}
        >
          X
        </Button>
      ),
    }));
  }

  const handleClick = (id: number) => async (e: { key: string }) => {
    await changeRoleUser(id, e.key === "admin" ? true : false);
    setNewChange((prev) => !prev);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            borderColor: "#000",
            bodySortBg: "#E3F8FF",
            headerSortHoverBg: "#E3F8FF",
            headerSortActiveBg: "#E3F8FF",
            headerBg: "#28CC9E",
            rowHoverBg: "#FFDD83",
            headerBorderRadius: 0,
          },
          Pagination: {
            margin: 0,
          },
        },
      }}
    >
      <Table<TableData>
        columns={columns}
        dataSource={processData}
        pagination={{ pageSize: 4 }}
        style={{ width: "80%" }}
      />
      {targetedUser}
    </ConfigProvider>
  );
}
