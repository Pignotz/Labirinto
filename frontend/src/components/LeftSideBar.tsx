import React from "react";
import { Card, Listbox, ListboxItem } from "@heroui/react";
import GlassCard from "./GlassCard";

type Props = {
  className?: string;
  activeKey: string;
  setActiveKey: (key: string) => void;
};

export default function LeftSideBar({className, activeKey, setActiveKey }: Props) {
  const sidebarItems = [
    { key: "play", label: "🎮 Gioca" },
    { key: "collectibles", label: "✨ Collezionabili" },
    { key: "achievements", label: "🏆 Achievements" },
  ];

  return (
    <GlassCard className={`flex flex-col p-3 gap-4 ${className}`}>
      <Listbox
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[activeKey]}
        className="w-40 ml-2"
      >
        {sidebarItems.map((item) => (
          <ListboxItem
            key={item.key}
            variant={activeKey === item.key ? "solid" : "light"}
            color={activeKey === item.key ? "primary" : "default"}
            className="w-full"
            onPress={() => setActiveKey(item.key)}
          >
            {item.label}
          </ListboxItem>
        ))}
      </Listbox>
    </GlassCard>
  );
}
