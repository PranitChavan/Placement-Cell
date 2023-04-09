import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../Config/supabase.client';
import './StudentsForm.css';

export default function StudentDetails() {
  const { currentUser } = useAuth();
  const [resumeFile, setResumeFile] = useState();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setFormData((prevData) => {
      return { ...prevData, [id]: value, email: currentUser.email };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await uploadResume();
      await createStudentFormRecord();
    } catch (err) {
      alert(err);
    }
    setLoading(false);
    navigate(-1);
  };

  async function createStudentFormRecord() {
    const { name, email, qualifications, contact: phone, passingYear: passing_year, skills } = formData;

    const { data: resume_url, error1 } = supabase.storage.from('resumes').getPublicUrl(`public/${currentUser.displayName}`);

    const { data, error } = await supabase.from('Student_Details').upsert({
      student_id: currentUser.uid,
      name,
      email,
      qualifications,
      phone,
      passing_year,
      skills,
      resume_url: resume_url.publicUrl,
    });

    if (error) alert('Details not updated! Please try again');

    alert('Your details are saved!');
  }

  const uploadResume = async () => {
    const { data, error } = supabase.storage.from('resumes').upload(`public/${currentUser.displayName}`, resumeFile, {
      upsert: true,
    });

    if (error) alert('Resume not uploaded. Please try again!');
  };

  return (
    <>
      <div className="container register">
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-md-3 register-left">
              <h3>Welcome</h3>
              <p>Please fill the correct details, as this details will be forwarded to the companies you applied for.</p>
              <br />
            </div>
            <div className="col-md-9 register-right">
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <h3 className="register-heading">Student Form</h3>
                  <div className="row register-form">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          id="name"
                          className="form-control mb-2"
                          placeholder="Full Name *"
                          defaultValue={currentUser.displayName}
                          onChange={inputHandler}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control  mb-2"
                          placeholder="Qualifications *"
                          id="qualifications"
                          onChange={inputHandler}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control  mb-2"
                          placeholder="Passing Year *"
                          id="passingYear"
                          onChange={inputHandler}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control  mb-2"
                          placeholder="Skill *"
                          id="skills"
                          onChange={inputHandler}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control  mb-2"
                          placeholder="Your Email *"
                          id="email"
                          defaultValue={currentUser.email}
                          onChange={inputHandler}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="txtEmpPhone"
                          className="form-control  mb-2"
                          placeholder="Your Phone *"
                          id="contact"
                          onChange={inputHandler}
                        />
                      </div>

                      <div className="form-group mt-3">
                        <label htmlFor="formFileDisabled" className="form-label">
                          Uplode CV *
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          id="resume"
                          required
                          onChange={(e) => setResumeFile(e.target.files[0])}
                        />
                      </div>
                      <input type="submit" className="btnRegister" value="Register" disabled={loading} />
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade show" id="profile" role="tabpanel" aria-labelledby="profile-tab"></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
