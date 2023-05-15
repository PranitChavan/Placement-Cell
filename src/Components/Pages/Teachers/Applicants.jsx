import { useLocation } from 'react-router-dom';
import { fetchApplicantsData } from '../../../Utils/fetchApplicantsData';
import { getJobDetails } from '../../../Utils/helpers';

import { useNavigate } from 'react-router-dom';
import ApplicantsTable from '../../UI/Tables/Teachers/ApplicantsTable';
import CircularColor from '../../UI/Progress';
import { useQuery } from '@tanstack/react-query';
import StandardButton from '../../UI/Buttons/Button';
import './Applicants.css';
import Confirmation from '../../UI/ConfirmationDialog';
import saveFile from '../../../Utils/excel';

export default function Applicants() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    state: { postId },
  } = location;

  const {
    data: applicantsData,
    isLoadingApplicants,
    isFetching,
  } = useQuery({
    queryKey: ['applicants'],
    queryFn: () => fetchApplicantsData(postId),
    refetchOnWindowFocus: false,
  });

  const { data: companyData, isLoading: isLoadingCompanyData } = useQuery({
    queryKey: ['companyData'],
    queryFn: () => getJobDetails(postId),
    refetchOnWindowFocus: false,
  });

  if (isLoadingApplicants || isLoadingCompanyData || isFetching) {
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />;
  }

  const filterData = (data) => {
    const studentsWithoutId = data.map((student) => {
      const { student_id, profile_picture, ...studentWithoutId } = student;
      return studentWithoutId;
    });

    return studentsWithoutId;
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }} className="idk container">
        <h1 style={{ marginTop: '70px', marginBottom: '30px', color: '#d8e1e7', textAlign: 'center' }}>
          {companyData[0].company_name}
        </h1>

        <StandardButton
          operation={() => saveFile(`${companyData[0].company_name}.csv`, filterData(applicantsData), 'text/csv', false)}
        >
          Export to Excel
        </StandardButton>
      </div>
      {<ApplicantsTable data={applicantsData} postId={postId} />}

      {/* <GenericTable props={props} /> */}
      <div className="header container" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
        <StandardButton operation={() => navigate('/Dashboard')}>Go Back</StandardButton>
      </div>
      <Confirmation />
    </>
  );
}
