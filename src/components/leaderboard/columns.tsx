import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Points = {
  uniqueId: number;
  address: string;
  points: number;
  identities?: [{}];
};

export const columns: ColumnDef<Points>[] = [
  {
    accessorKey: "uniqueId",
    header: "No.",
  },
  {
    accessorKey: "address",
    header: "Member",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
];
