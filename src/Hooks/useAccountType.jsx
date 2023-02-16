// THIS HOOK RETURNS TYPE OF THE CURRENT ACCOUNT : TEACHER/ STUDENT
import { useAuth } from '../Context/AuthContext';
import { useQuery } from '@tanstack/react-query';

export function useAccountType(currentUser) {
  const { accountType: getAccountType } = useAuth();

  const { data: accountType, isLoading } = useQuery({
    queryKey: ['accountType'],
    queryFn: () => getAccountType(currentUser),
    refetchOnWindowFocus: false,
  });

  return [accountType, isLoading];
}
