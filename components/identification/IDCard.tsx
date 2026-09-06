import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Image } from "react-native";

type IDCardProps = {
  imageUri: string;
  name: string;
  lastName: string;
  idNumber: string;
};

const IDField = ({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <Box className="flex-row items-baseline gap-2">
    <Text
      size="2xs"
      className="w-20 uppercase tracking-wide text-muted-foreground"
    >
      {label}
    </Text>
    <Text size="sm" bold={emphasis} className="flex-1 text-foreground">
      {value}
    </Text>
  </Box>
);

export const IDCard = ({ imageUri, name, lastName, idNumber }: IDCardProps) => {
  return (
    <Box className="overflow-hidden rounded-xl border border-border bg-card">
      <Box className="h-1.5 bg-primary" />

      <Box className="flex-row gap-4 p-4">
        <Image
          source={{ uri: imageUri }}
          className="h-36 w-28 rounded-lg border border-border bg-muted"
          resizeMode="cover"
        />

        <Box className="flex-1 justify-center gap-1.5">
          <IDField label="Name" value={name} emphasis />
          <IDField label="Surname" value={lastName} emphasis />
          <IDField label="ID Number" value={idNumber} />
        </Box>
      </Box>
    </Box>
  );
};
