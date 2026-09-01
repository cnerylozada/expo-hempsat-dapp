import { useAuth } from "@/providers/AuthProvider";
import { TokenExpiredError } from "@/server/http";
import { useQuery, type QueryKey } from "@tanstack/react-query";

export const useAuthedQuery = <TData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
) => {
  const { onSignOut } = useAuth();

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        if (error instanceof TokenExpiredError) await onSignOut();
        throw error;
      }
    },
  });
};
