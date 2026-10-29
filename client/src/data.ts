import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ChartNoAxesCombined,
  CircleDollarSign,
  Landmark,
  ListChecks,
  WalletCards,
} from "lucide-react";

export type Page = "overview" | "markets" | "portfolio" | "activity" | "wallet" | "market-detail";
export type Outcome = "yes" | "no";
export type MarketStatus = "Open" | "Closing soon" | "Resolved";

export interface NavItem {
  label: string;
  page: Exclude<Page, "market-detail">;
  icon: LucideIcon;
}

export interface Market {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  expires: string;
  volume: string;
  yes: number;
  no: number;
  status: MarketStatus;
  participants: number;
}

export const navigation: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ label: "Command centre", page: "overview", icon: ChartNoAxesCombined }],
  },
  {
    label: "Markets",
    items: [
      { label: "All markets", page: "markets", icon: Landmark },
      { label: "My positions", page: "portfolio", icon: ListChecks },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Wallet", page: "wallet", icon: WalletCards },
      { label: "Activity", page: "activity", icon: Activity },
      { label: "Sign in", page: "wallet", icon: CircleDollarSign },
    ],
  },
];

export const markets: Market[] = [
  {
    id: "city-metro",
    number: "MKT-024",
    title: "Will Bengaluru Metro reach Whitefield before 11 AM?",
    category: "Local events",
    description: "Resolves Yes if the first train reaches Whitefield (Kadugodi) before 11:00 AM IST on Friday.",
    expires: "Closes in 02h 18m",
    volume: "₹18,420",
    yes: 62,
    no: 38,
    status: "Open",
    participants: 184,
  },
  {
    id: "india-cricket",
    number: "MKT-023",
    title: "Will India win the next ODI series?",
    category: "Sport",
    description: "Resolves from the official series result. A tie or no-result series resolves No.",
    expires: "Closes in 1d 04h",
    volume: "₹42,865",
    yes: 71,
    no: 29,
    status: "Open",
    participants: 391,
  },
  {
    id: "repo-release",
    number: "MKT-021",
    title: "Will the mobile app launch before 31 October?",
    category: "Technology",
    description: "Resolves Yes when the public production app is available in both app stores.",
    expires: "Closes in 44m",
    volume: "₹8,640",
    yes: 45,
    no: 55,
    status: "Closing soon",
    participants: 93,
  },
  {
    id: "monsoon-rain",
    number: "MKT-019",
    title: "Will Mumbai record rain this weekend?",
    category: "Weather",
    description: "Resolves against IMD's Santacruz daily observation data for Saturday and Sunday.",
    expires: "Resolved 3h ago",
    volume: "₹30,120",
    yes: 84,
    no: 16,
    status: "Resolved",
    participants: 276,
  },
];

export const activity = [
  { id: "TXN-8921", item: "Order · Bengaluru Metro", type: "Yes position", amount: "−₹250.00", date: "Today, 09:42", state: "Completed" },
  { id: "TXN-8915", item: "Demo funds", type: "Wallet credit", amount: "+₹500.00", date: "Yesterday, 16:20", state: "Completed" },
  { id: "TXN-8890", item: "Mumbai weekend rain", type: "Market payout", amount: "+₹823.50", date: "26 Oct, 12:04", state: "Resolved" },
  { id: "TXN-8881", item: "App launch before 31 Oct", type: "No position", amount: "−₹150.00", date: "25 Oct, 18:11", state: "Completed" },
];
