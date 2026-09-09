import { AppButton } from "@/components/AppButton";
import { useAuthedQuery } from "@/components/authedRequests";
import { InstructionsCard } from "@/components/InstructionsCard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { Text } from "@/components/ui/text";
import { queryKeys } from "@/libs/queryKeys";
import { useAuth } from "@/providers/AuthProvider";
import { getMyUser, saveUserIdentification } from "@/server/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect, useRouter } from "expo-router";
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
  const { token } = useAuth();

  const { data, isLoading, isError, error, refetch, isRefetching } =
    useAuthedQuery(queryKeys.users.myUser, () => getMyUser(token));

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
      router.replace("/(drawer)/dashboard");
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

  // Guard order matters: `data` is undefined while the query is in flight, so
  // checking `inquiry_id` first would flash this screen before redirecting.
  if (isLoading || isRefetching) return <LoadingScreen />;

  if (isError) {
    return (
      <StatusBanner
        theme="error"
        title="Something went wrong"
        description={error.message}
        action={{
          icon: "refresh",
          label: "Retry",
          onPress: () => refetch(),
        }}
      />
    );
  }

  // Already verified — there is nothing to do here, and re-running Persona
  // would just overwrite a good inquiry_id.
  if (data?.inquiry_id) return <Redirect href="/(drawer)/dashboard" />;

  return (
    <View>
      <View className="mb-6">
        <InstructionsCard title="Before you start" items={tips} />
      </View>

      {status === "idle" && (
        <AppButton
          text="Start Verification"
          icon="finger-print-outline"
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
