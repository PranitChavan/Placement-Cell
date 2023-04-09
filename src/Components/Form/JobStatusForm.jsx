import { Container, Button, MenuItem, TextField, Box, InputLabel, FormControl } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '../../Config/supabase.client';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import CircularColor from '../UI/Progress';
import { useAccountType } from '../../Hooks/useAccountType';
import { useNavigate } from 'react-router-dom';

let fields = new Map([
  ['interviewDate', true],
  ['interviewResult', true],
  ['failedRound', true],
  ['interviewExperience', true],
  ['withdrawnReason', true],
  ['feedback', true],
]);

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export default function JobStatusForm() {
  const [formData, setFormData] = useState({});
  const [fieldsHidden, setFieldsHidden] = useState(fields);

  const { currentUser } = useAuth();
  const [accountType] = useAccountType(currentUser);

  const { postId, studentId } = useParams();

  const navigate = useNavigate();

  const uploadJobStatus = async () => {
    const {
      jobStatus: job_status = null,
      interviewDate: interview_date = null,
      interviewResult: interview_result = null,
      failedRound: failed_round = null,
      interviewExperience: interview_experience = null,
      withdrawnReason: notattended_reason = null,
      feedback = null,
    } = formData;

    const { data, error } = await supabase.from('Job_Status').upsert(
      {
        id: Date.now().toString(),
        student_id: studentId,
        post_id: postId,
        job_status,
        interview_date,
        interview_result,
        failed_round,
        interview_experience,
        notattended_reason,
        feedback,
      },
      { onConflict: 'post_id' }
    );

    if (error) throw new Error('Failed to upload!');
    return data;
  };

  const { mutate: createRecord, isError } = useMutation({
    mutationFn: uploadJobStatus,
  });

  const fetchJobStatus = async () => {
    const { data, error } = await supabase
      .from('Job_Status')
      .select()
      .eq('post_id', postId)
      .eq('student_id', studentId)
      .select();

    if (error) throw new Error('Failed');

    return data;
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['jobStatus'],
    queryFn: () => fetchJobStatus(),
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setFormData({
          jobStatus: data[0].job_status,
          interviewDate: data[0].interview_date,
          interviewResult: data[0].interview_result,
          failedRound: data[0].failed_round,
          interviewExperience: data[0].interview_experience,
          withdrawnReason: data[0].notattended_reason,
          feedback: data[0].feedback,
        });
        toggle(data[0]?.job_status, true, data);
      }
    },
  });

  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });

    if (value && (name === 'jobStatus' || name === 'interviewResult')) toggle(value);
  };

  const clearFields = () => {
    setFormData((prev) => {
      return {
        jobStatus: prev.jobStatus,
        interviewDate: null,
        interviewResult: null,
        failedRound: null,
        interviewExperience: null,
        withdrawnReason: null,
        feedback: null,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRecord();

    if (isError) {
      return alert('Failed to update your data, please try again!');
    }

    alert('Your data is updated!');
  };

  const toggle = (formValue, isFromDb = false, data) => {
    let interviewResult = (data && data.length > 0 && data[0].interview_result) || formData.interviewResult;

    fieldsHidden.forEach((_, key) => {
      if (formValue === 'Interview Scheduled') {
        setFieldsHidden((prev) => {
          if (isFromDb === false) {
            clearFields();
          } else {
            setFormData({
              // jobStatus: data && data[0]?.job_status,
              // interviewDate: formatDate(data[0]?.interview_date),
            });
          }
          return new Map([...prev, [key, key === 'interviewDate' ? false : true]]);
        });
        return;
      }

      if (formValue === 'Interview Completed') {
        setFieldsHidden((prev) => {
          isFromDb || clearFields();
          return new Map([...prev, ['interviewDate', true], ['interviewResult', false], ['feedback', false]]);
        });

        if (interviewResult === 'Failed') {
          setFieldsHidden((prev) => {
            return new Map([
              ...prev,
              ['interviewDate', true],
              ['failedRound', false],
              ['interviewExperience', false],
              ['feedback', false],
            ]);
          });
          return;
        }

        if (interviewResult === 'Passed') {
          setFieldsHidden(new Map([...fields, ['interviewResult', false], ['feedback', false]]));
          return;
        }

        return;
      }

      if (formValue === 'Failed') {
        setFieldsHidden((prev) => {
          return new Map([
            ...prev,
            ['interviewDate', true],
            ['failedRound', false],
            ['interviewExperience', false],
            ['feedback', false],
          ]);
        });
        return;
      }

      if (formValue === 'Passed') {
        setFieldsHidden(new Map([...fields, ['interviewResult', false], ['feedback', false]]));
        return;
      }

      if (formValue === 'Not attented the interview') {
        isFromDb || clearFields();
        setFieldsHidden(new Map([...fields, ['withdrawnReason', false]]));
        return;
      }

      if (formValue === 'No response from the company yet') {
        isFromDb || clearFields();
        setFieldsHidden(new Map([...fields]));
        return;
      }

      if (formValue === 'Offered Job') {
        isFromDb || clearFields();
        setFieldsHidden(new Map([...fields, ['feedback', false]]));
      }
    });
  };

  if (isLoading || isFetching) {
    return <CircularColor styles={{ display: 'flex', justifyContent: 'center' }} />;
  }

  return (
    <>
      <Container maxWidth="sm" style={{ color: 'white' }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextField
            required
            select={true}
            label="Job Status"
            fullWidth
            onChange={(e) => {
              inputHandler(e);
            }}
            margin="normal"
            name="jobStatus"
            defaultValue={data[0]?.job_status || ''}
            disabled={accountType === 'Teacher'}
          >
            {[
              'Interview Scheduled',
              'Interview Completed',
              'Offered Job',
              'Not attented the interview',
              'No response from the company yet',
            ].map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            hidden={fieldsHidden.get('interviewDate')}
            //  id="date"
            label="Interview Date"
            type="date"
            sx={{ width: '100%', mt: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            name="interviewDate"
            onChange={(e) => {
              inputHandler(e);
            }}
            defaultValue={formatDate(data[0]?.interview_date || '')}
            // value={formData.interviewDate || ''}
            disabled={accountType === 'Teacher'}
          />

          <TextField
            hidden={fieldsHidden.get('interviewResult')}
            //  id="outlined-select-currency"
            select={true}
            label="Interview Result"
            fullWidth
            onChange={(e) => {
              inputHandler(e);
            }}
            margin="normal"
            name="interviewResult"
            defaultValue={data[0]?.interview_result || ''}
            // value={formData.interviewResult || ''}
            disabled={accountType === 'Teacher'}
          >
            {['Passed', 'Failed'].map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            hidden={fieldsHidden.get('failedRound')}
            //  id="outlined-select-currency"
            select={true}
            label="Failed Round"
            fullWidth
            onChange={(e) => {
              inputHandler(e);
            }}
            margin="normal"
            name="failedRound"
            defaultValue={data[0]?.failed_round || ''}
            // value={formData.failedRound || ''}
            disabled={accountType === 'Teacher'}
          >
            {['Aptitude', 'Technical', 'Other'].map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            hidden={fieldsHidden.get('interviewExperience')}
            //  id="outlined-multiline-static"
            label="Please write about your interview experience."
            multiline
            rows={4}
            style={{ width: '100%', marginTop: '5px' }}
            name="interviewExperience"
            onChange={(e) => {
              inputHandler(e);
            }}
            defaultValue={data[0]?.interview_experience || ''}
            // value={formData.interviewExperience || ''}
            disabled={accountType === 'Teacher'}
          />

          <TextField
            hidden={fieldsHidden.get('withdrawnReason')}
            //   id="outlined-multiline-static"
            label="Please specify the reason for not attending the interview."
            multiline
            rows={4}
            style={{ width: '100%', marginTop: '5px' }}
            name="withdrawnReason"
            onChange={(e) => {
              inputHandler(e);
            }}
            //value={formData.withdrawnReason || ''}
            defaultValue={data[0]?.notattended_reason || ''}
            disabled={accountType === 'Teacher'}
          />

          <TextField
            hidden={fieldsHidden.get('feedback')}
            //  id="outlined-multiline-static"
            label="Please give the feedback or comment on how we can improve the placement process."
            multiline
            rows={4}
            style={{ width: '100%', marginTop: '8px' }}
            name="feedback"
            onChange={(e) => {
              inputHandler(e);
            }}
            //  value={formData.feedback || ''}
            defaultValue={data[0]?.feedback || ''}
            disabled={accountType === 'Teacher'}
          />

          {accountType === 'Student' && (
            <Button type="submit" variant="contained" fullWidth style={{ marginTop: '15px' }} disabled={false}>
              Submit
            </Button>
          )}

          {accountType === 'Teacher' && (
            <Button
              type="button"
              variant="contained"
              fullWidth
              style={{ marginTop: '15px' }}
              disabled={false}
              onClick={() => navigate(-1)}
            >
              Go back
            </Button>
          )}
        </form>
      </Container>
    </>
  );
}
