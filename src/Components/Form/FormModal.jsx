import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAuth } from '../../Context/AuthContext';

import { supabase } from '../../Config/supabase.client';

function FormModal(props) {
  const { getPostDetail, onHide } = props;
  const [formData, setFormData] = useState();
  const { currentUser } = useAuth();

  const inputHandler = function (e) {
    const id = e.target.id;
    const value = e.target.value;

    setFormData((prevData) => {
      return { ...prevData, [id]: value, teacherId: currentUser.uid, post_id: Date.now().toString() };
    });
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    await createPostRecord();
    getPostDetail([formData]);
    onHide();
  };

  async function createPostRecord() {
    let { description, company_name, job_title, location, skills_required, post_id: id } = formData;

    const { data, error } = await supabase.from('Job_Posts').insert({
      post_id: id,
      teacher_id: currentUser.uid,
      description,
      company_name,
      job_title,
      location,
      skills_required,
    });
  }

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Job Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="job_title" className="form-label">
              Job Title
            </label>
            <input type="text" className="form-control" id="job_title" required onChange={inputHandler} />
          </div>
          <div className="mb-3">
            <label htmlFor="company_name" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              className="form-control"
              id="company_name"
              aria-describedby="emailHelp"
              required
              onChange={inputHandler}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input type="text" className="form-control" id="location" required onChange={inputHandler} />
          </div>
          <div className="mb-3">
            <label htmlFor="skills_required" className="form-label">
              Skills Required
            </label>
            <input
              type="text"
              className="form-control"
              id="skills_required"
              placeholder="Seperate each skill by a comma. Eg. HTML, CSS, Linux Automation"
              required
              onChange={inputHandler}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Job description
            </label>
            <textarea className="form-control" id="description" rows="3" required onChange={inputHandler}></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default FormModal;
