import PlacedTable from '../UI/PlacedTable';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../Config/supabase.client';

async function getData() {
  let { data, error } = await supabase.rpc('get_placed_students');

  if (error) console.error(error);

  return data;
}

export default function PlacedStudents() {
  const { data, isLoading } = useQuery({
    queryKey: ['placedStudents'],
    queryFn: () => getData(),
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <PlacedTable data={data} isLoading={isLoading} />
    </>
  );
}
