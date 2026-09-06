import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";

// Icons are not styled by NativeWind unless they opt in, same as gluestack does
// for its own UIIcon in components/ui/button/index.tsx.
cssInterop(Ionicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type Reason = {
  icon: IconName;
  title: string;
  description: string;
};

const REASONS: Reason[] = [
  {
    icon: "shield-checkmark-outline",
    title: "Compliance",
    description:
      "Hemp farming is regulated — verifying who's behind each farm keeps the whole network compliant.",
  },
  {
    icon: "finger-print-outline",
    title: "Trust",
    description:
      "Buyers and partners can trust that every registered farm is tied to a real, verified person.",
  },
  {
    icon: "key-outline",
    title: "Access",
    description:
      "Verification unlocks farm registration and the blockchain certificates tied to your wallet.",
  },
];

/**
 * Explains why identity verification matters, shown above the "Please
 * identify yourself" prompt on the dashboard. Content is fixed rather than
 * prop-driven — this has a single call site today, so it isn't generalized
 * into an `InstructionsCard`-style reusable component yet. If a second
 * screen needs the same "why this matters" treatment, promote it then.
 */
export function KycExplainer() {
  return (
    <Box className="gap-3 rounded-xl border border-border bg-card p-4">
      <Box className="flex-row items-center gap-2">
        <Ionicons
          name="information-circle-outline"
          size={20}
          className="text-primary"
        />
        <Text bold className="text-foreground">
          Why we ask for identity verification
        </Text>
      </Box>

      <Box className="gap-3">
        {REASONS.map((reason) => (
          <Box key={reason.title} className="flex-row items-start gap-2.5">
            <Box className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Ionicons
                name={reason.icon}
                size={16}
                className="text-primary"
              />
            </Box>
            <Box className="flex-1">
              <Text size="sm" bold className="text-foreground">
                {reason.title}
              </Text>
              <Text size="sm" className="text-muted-foreground">
                {reason.description}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
