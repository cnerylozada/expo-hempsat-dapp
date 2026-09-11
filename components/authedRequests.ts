import { useAuth } from "@/providers/AuthProvider";
import { TokenExpiredError } from "@/server/http";
import {
  useMutation,
  useQuery,
  type MutationFunction,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";

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

export const useAuthedMutation = <
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, Error, TVariables, TContext> & {
    mutationFn: MutationFunction<TData, TVariables>;
  },
) => {
  const { onSignOut } = useAuth();
  const { mutationFn } = options;

  return useMutation({
    ...options,
    mutationFn: async (variables, context) => {
      try {
        return await mutationFn(variables, context);
      } catch (error) {
        if (error instanceof TokenExpiredError) await onSignOut();
        throw error;
      }
    },
  });
};
