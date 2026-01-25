import React from "react";
import { Card } from "@heroui/react";

type Props = { className?: string };

export default function RightSideBar({ className = "" }: Props): JSX.Element {
  return (
    <Card className={`flex flex-col glass ${className}`}>
      right
    </Card>
  );
}
