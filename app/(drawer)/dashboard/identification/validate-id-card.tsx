import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { saveUserIdentification } from "@/server/users";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
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
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (inquiryId) {
      const onUpdateUser = async () => {
        const token = await SecureStore.getItemAsync("jwt");
        saveUserIdentification(token, inquiryId).then(() => {
          setTimeout(() => {
            router.replace("/(drawer)/dashboard/identification");
          }, 3000);
        });
      };
      onUpdateUser();
    }
  }, [inquiryId]);

  const startVerification = () => {
    setStatus("scanning");

    Inquiry.fromTemplate(TEMPLATE_ID)
      .environment(Environment.SANDBOX)
      .onComplete(async (inquiryId, inquiryStatus, fields) => {
        if (inquiryStatus === "completed" && inquiryId) {
          setInquiryId(inquiryId);
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
      <View className="mb-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 gap-3">
        <ThemedText type="defaultSemiBold">Before you start</ThemedText>
        {tips.map((tip, index) => (
          <View key={index} className="flex-row items-start gap-2">
            <ThemedText type="subtext">{index + 1}.</ThemedText>
            <ThemedText type="subtext" className="flex-1">
              {tip}
            </ThemedText>
          </View>
        ))}
      </View>

      {status === "idle" && (
        <ThemedButton title="Start Verification" onPress={startVerification} />
      )}

      {status === "scanning" && (
        <View>
          <ActivityIndicator size="small" color="#2563EB" />
          <ThemedText>Verifying...</ThemedText>
        </View>
      )}

      {status === "approved" && (
        <View>
          <ThemedText>Verified! Check the console.</ThemedText>
        </View>
      )}
    </View>
  );
}
