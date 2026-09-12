import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

export type MapHeaderProps = {
  /** Short label for what the map is for right now, e.g. "Draw your farm boundary". */
  title: string;
  onBack: () => void;
};

// Floats over a full-screen MapView: a back button on the left and a
// centered title pill, both clear of the status bar. Shared by
// FarmBoundaryMap (drawing a boundary) and FarmBoundaryViewer (viewing one).
export const MapHeader = ({ title, onBack }: MapHeaderProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="absolute inset-x-3" style={{ top: top + 12 }}>
      <TouchableOpacity
        onPress={onBack}
        className="absolute left-0 z-10 rounded-full bg-black/50 p-2"
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <View className="rounded-full bg-black/50 px-3 py-2">
          <Text bold size="sm" className="text-white">
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};
