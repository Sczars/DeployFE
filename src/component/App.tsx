import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import React, { useState } from "react";

const router = createRouter({ routeTree, context: {} as RouterContext });

export interface RouterContext {
  isChange: boolean;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  targetedUser: number;
  setTargetedUser: React.Dispatch<React.SetStateAction<number | undefined>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  order: {
    label: string;
    key: string;
  }[];
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const [isChange, setIsChange] = useState<boolean>(true);
  const [targetedUser, setTargetedUser] = useState<number>();
  const [page, setPage] = useState<number>(0);
  const order = [
    {
      label: "Admin",
      key: "admin",
    },
    {
      label: "User",
      key: "user",
    },
  ];

  return (
    <RouterProvider
      router={router}
      context={{
        isChange,
        setIsChange,
        targetedUser,
        setTargetedUser,
        page,
        setPage,
        order,
      }}
    />
  );
}
