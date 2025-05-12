import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import React from "react";

type RouterContextType = {
  isChange: boolean;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  targetedUser: number;
  setTargetedUser: React.Dispatch<React.SetStateAction<number|undefined>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  order: {
    label: string;
    key: string;
  }[];
};

export const Route = createRootRouteWithContext<RouterContextType>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
