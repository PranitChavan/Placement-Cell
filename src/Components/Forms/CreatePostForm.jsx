import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAuth } from '../../Context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNavigationStore from '../../Stores/navigationStore';
import { createPostRecord } from './formServices';

function CreatePost() {
  const [formData, setFormData] = useState();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const departmentData = queryClient.getQueryData(['departmentDetails']);

  const togglePostCreationForm = useNavigationStore((state) => state.togglePostCreationForm);
  const isPostCreationFormOpen = useNavigationStore((state) => state.isPostCreationFormOpen);

  const inputHandler = function (e) {
    const id = e.target.id;
    const value = e.target.value;

    setFormData((prevData) => {
      return {
        ...prevData,
        [id]: value,
        teacherId: currentUser.uid,
        post_id: Date.now().toString(),
        department_id: departmentData && departmentData.length > 0 && departmentData[0].department_id,
      };
    });
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    createPost([formData, currentUser]);
    togglePostCreationForm();
  };

  const { mutate: createPost } = useMutation({
    mutationFn: ([formData, currentUser]) => {
      return createPostRecord([formData, currentUser]);
    },

    onSuccess: () => {
      queryClient.setQueryData(['jobPosts'], (oldData) => {
        return [...oldData, formData];
      });
    },
  });

  return (
    <Modal
      show={isPostCreationFormOpen}
      onHide={togglePostCreationForm}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
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

          {/* <div className="mb-3">
            <label htmlFor="skills_required" className="form-label">
              Department
            </label>
            <select className="form-select" aria-label="Default select example" id="department" onChange={inputHandler}>
              <option value="BSC">BSC</option>
              <option value="MSC">MSC</option>
            </select>
          </div> */}

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default CreatePost;
