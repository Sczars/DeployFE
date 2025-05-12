import { createFileRoute } from "@tanstack/react-router";
import { ReactNode, useEffect, useState } from "react";
import { deleteUserMessage, getUserMessages } from "../../../script/checkToken";
import Table, { ColumnsType } from "antd/es/table";
import { Button, ConfigProvider } from "antd";

export const Route = createFileRoute("/_layout/dashboard/messages")({
  component: MessagesBoard,
  loader: ({ context }) => {
    return {
      targetUser: context.targetedUser,
    };
  },
});

interface TableData {
  key: number;
  receiver: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type Message = {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  remove: ReactNode;
};

export default function MessagesBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChange, setIsChange] = useState<boolean>(false);
  const { targetUser } = Route.useLoaderData();

  useEffect(() => {
    getUserMessages(targetUser).then((data) => {
      Array.isArray(data) ? setMessages(data) : setMessages([]);
    });
  }, [targetUser, isChange]);

  function timeFormatter(text: string) {
    const uDate = new Date(text);
    const gmt7 = new Date(uDate.getTime() + 7 * 60 * 60 * 1000);

    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24-hour time
    });

    // Format the date and replace the separator for your required format
    const formattedDate = formatter.format(gmt7);
    const [datePart, timePart] = formattedDate.split(", ");
    const [day, month, year] = datePart.split("/");

    return `${day}/${month}/${year}\n${timePart}`;
  }

  const columns: ColumnsType<TableData> = [
    {
      key: 0,
      title: "Receiver Id",
      dataIndex: "receiver",
      width: "10%",
    },
    {
      key: 1,
      title: "Content",
      dataIndex: "content",
      width: "45%",
    },
    {
      key: 2,
      title: "Send at",
      dataIndex: "createdAt",
      width: "10%",
      render: (text, _) => timeFormatter(text),
    },
    {
      key: 3,
      title: "Reply at",
      dataIndex: "updatedAt",
      width: "10%",
      render: (text, _) => timeFormatter(text),
    },
    {
      key: 4,
      title: "Remove",
      dataIndex: "remove",
      width: "5%",
    },
  ];
  const processedData: TableData[] = messages.map((msg) => ({
    key: msg.id,
    receiver: msg.receiver,
    content: msg.content,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    remove: (
      <Button
        variant="solid"
        color="volcano"
        style={{ width: "100%" }}
        onClick={async () => {
          await deleteUserMessage(msg.id);
          setIsChange((prev) => !prev);
        }}
      >
        X
      </Button>
    ),
  }));

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
        dataSource={processedData}
        columns={columns}
        pagination={{ pageSize: 3 }}
        style={{ width: "80%" }}
      ></Table>
    </ConfigProvider>
  );
}
