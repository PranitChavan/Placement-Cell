import PlacedForm from '../Form/PlacedForm';
import StandardButton from '../UI/Button';
import { useNavigate } from 'react-router-dom';

export default function Placed() {
  const navigate = useNavigate();

  return (
    <>
      <PlacedForm />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <StandardButton operation={() => navigate('/Dashboard')}>Go Back</StandardButton>
      </div>
    </>
  );
}
