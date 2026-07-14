"use client";

import StreamEngine from "@/components/features/stream-engine";
import { BATTERY_TRADER_SECTIONS } from "./battery-trader-sections";

export default function BatteryTraderContent({ isStatic = false }: { isStatic?: boolean }) {
  return <StreamEngine sections={BATTERY_TRADER_SECTIONS} isStatic={isStatic} />;
}
