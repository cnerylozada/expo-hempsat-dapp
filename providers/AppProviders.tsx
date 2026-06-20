import { AuthProvider } from "@/providers/AuthProvider";
import { PhotoProvider } from "@/providers/PhotoProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ThirdwebProvider } from "thirdweb/react";

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PhotoProvider>{children}</PhotoProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}
