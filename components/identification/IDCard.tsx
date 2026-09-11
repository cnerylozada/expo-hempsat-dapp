import { FieldRow } from "@/components/FieldRow";
import { Box } from "@/components/ui/box";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { useEffect, useState } from "react";
import { Image } from "react-native";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type IDCardProps = {
  imageUri: string;
  name: string;
  lastName: string;
  idNumber: string;
};

export const IDCard = ({ imageUri, name, lastName, idNumber }: IDCardProps) => {
  // `imageUri` can be a non-empty URL that still fails to load — Persona's
  // file links carry a short-lived access token, so a stored `avatar_url`
  // reliably expires. `<Image>` fails silently otherwise; `onError` is what
  // actually tells us the load didn't work.
  const [failedToLoad, setFailedToLoad] = useState(false);
  useEffect(() => setFailedToLoad(false), [imageUri]);

  const showFallback = !imageUri || failedToLoad;

  return (
    <Box className="overflow-hidden rounded-xl border border-border bg-card">
      <Box className="h-1.5 bg-primary" />

      <Box className="flex-row gap-4 p-4">
        <Box className="h-36 w-28 items-center justify-center rounded-lg border border-border bg-muted">
          {showFallback ? (
            <Ionicons
              name="person-circle-outline"
              size={48}
              className="text-muted-foreground"
            />
          ) : (
            <Image
              source={{ uri: imageUri }}
              className="h-full w-full rounded-lg"
              resizeMode="cover"
              onError={() => setFailedToLoad(true)}
            />
          )}
        </Box>

        <Box className="flex-1 justify-center gap-1.5">
          <FieldRow label="Name" value={name} emphasis />
          <FieldRow label="Surname" value={lastName} emphasis />
          <FieldRow label="ID Number" value={idNumber} />
        </Box>
      </Box>
    </Box>
  );
};
