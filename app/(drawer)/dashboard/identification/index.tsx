import { getMyUser } from "@/server/users";
import { Redirect, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { IDCard } from "./_components/IDCard";
import { IUser } from "./_components/models";

export default function IdentificationScreen() {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        setIsLoading(true);
        const token = await SecureStore.getItemAsync("jwt");
        const data = await getMyUser(token);
        setUser(data);
        setIsLoading(false);
      };
      fetchUser();
    }, []),
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user && user.inquiry_id ? (
    <View>
      <IDCard
        name={user.first_name ?? ""}
        lastName={user.last_name ?? ""}
        idNumber={user.national_id ?? ""}
        imageUri={user.avatar_url ?? ""}
      />
    </View>
  ) : (
    <Redirect href={"/(drawer)/dashboard/identification/validate-id-card"} />
  );
}
