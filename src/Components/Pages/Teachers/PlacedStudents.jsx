import PlacedTable from '../../UI/Tables/Teachers/PlacedStudentsTable';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../Config/supabase.client';

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

  const props = {
    headings: ['Name', 'Company Name', 'Package', 'Phone', 'Offer Letter', 'Photo'],
    data,
    isLoading,
    marginTop: 200,
  };

  return (
    <>
      <PlacedTable data={data} isLoading={isLoading} />
      {/* <GenericTable props={props} /> */}
    </>
  );
}
