// THIS HOOK RETURNS TYPE OF THE CURRENT ACCOUNT : TEACHER/ STUDENT

import { useQuery } from '@tanstack/react-query';
import { accountType as getAccountType } from '../Utils/helpers';

export function useAccountType(currentUser) {
  const { data: accountType, isLoading } = useQuery({
    queryKey: ['accountType'],
    queryFn: () => getAccountType(currentUser.uid),
    refetchOnWindowFocus: false,
  });

  return [accountType, isLoading];
}
