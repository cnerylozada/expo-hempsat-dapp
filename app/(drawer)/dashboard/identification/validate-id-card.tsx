import { AppButton } from "@/components/AppButton";
import { InstructionsCard } from "@/components/InstructionsCard";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { saveUserIdentification } from "@/server/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Inquiry, { Environment } from "react-native-persona";

const TEMPLATE_ID = process.env.EXPO_PUBLIC_PERSONA_TEMPLATE_ID!;
type Status = "idle" | "scanning" | "approved" | "declined";

const tips = [
  "Use a device with a good camera",
  "Find a well-lit area with no strong backlight",
  "Have your national ID document ready",
  "Keep your face and document clearly visible",
  "Avoid reflections on the document surface",
];

export default function ValidateIDCardScreen() {
  const [status, setStatus] = useState<Status>("idle");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await SecureStore.getItemAsync("jwt");
      return saveUserIdentification(token, id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.users.myUser,
        refetchType: "all",
      });
      router.replace("/(drawer)/dashboard/identification");
    },
  });

  const startVerification = () => {
    setStatus("scanning");

    Inquiry.fromTemplate(TEMPLATE_ID)
      .environment(Environment.SANDBOX)
      .onComplete(async (inquiryId, inquiryStatus, fields) => {
        if (inquiryStatus === "completed" && inquiryId) {
          mutation.mutate(inquiryId);
        } else {
          setStatus("declined");
        }
      })
      .onCanceled(() => {
        console.log("User cancelled verification");
        setStatus("idle");
      })
      .onError((error) => {
        console.log("Verification error:", error.message);
        setStatus("idle");
      })
      .build()
      .start();
  };

  return (
    <View>
      <View className="mb-4">
        <InstructionsCard title="Before you start" items={tips} />
      </View>

      {status === "idle" && (
        <AppButton
          text="Start Verification"
          icon="camera-outline"
          onPress={startVerification}
        />
      )}

      {status === "scanning" && (
        <View>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text>Verifying...</Text>
        </View>
      )}

      {status === "approved" && (
        <View>
          <Text>Verified! Check the console.</Text>
        </View>
      )}
    </View>
  );
}
