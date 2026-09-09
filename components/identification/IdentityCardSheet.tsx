import {
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
} from "@/components/ui/bottomsheet";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { IUser } from "@/server/models";
import Ionicons from "@expo/vector-icons/Ionicons";
import { IDCard } from "./IDCard";

export const IdentityCardSheet = ({
  user,
  onClose,
}: {
  user: IUser;
  onClose: () => void;
}) => (
  <BottomSheetPortal
    snapPoints={["45%"]}
    backdropComponent={BottomSheetBackdrop}
  >
    <BottomSheetDragIndicator />
    <BottomSheetContent className="gap-4 pb-6">
      <Box className="flex-row items-center justify-between">
        <Text bold className="text-foreground">
          Your ID
        </Text>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="close" size={22} className="text-muted-foreground" />
        </Pressable>
      </Box>

      <IDCard
        name={user.first_name ?? ""}
        lastName={user.last_name ?? ""}
        idNumber={user.national_id ?? ""}
        imageUri={user.avatar_url ?? ""}
      />
    </BottomSheetContent>
  </BottomSheetPortal>
);
