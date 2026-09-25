import { FieldRow } from "@/components/shared/FieldRow";
import { Box } from "@/components/ui/box";
import { IFarm } from "@/server/models";

export type FarmInfoCardProps = {
  farm: IFarm;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const FarmInfoCard = ({ farm }: FarmInfoCardProps) => (
  <Box className="gap-3 rounded-xl border border-border bg-card p-4">
    <FieldRow label="Name" value={farm.name} emphasis />
    <FieldRow label="Country" value={farm.country} />
    <FieldRow label="Address" value={farm.address} truncate />
    <FieldRow label="Registered" value={formatDate(farm.created_at)} />
  </Box>
);
