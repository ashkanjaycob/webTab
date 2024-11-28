import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "@formio/react";
import Swal from "sweetalert2";
import { fetchFormioAsync } from "../../../features/formio/formioSlice";
import "bootstrap/dist/css/bootstrap.min.css"; 

const BpmnViewer = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.formio);
  const formRef = useRef(null); 
  const [submittedData, setSubmittedData] = useState(null); 
  const [allSubmissions, setAllSubmissions] = useState([]); 

  useEffect(() => {
    dispatch(fetchFormioAsync());
  }, [dispatch]);

  useEffect(() => {

    const storedSubmissions =
      JSON.parse(localStorage.getItem("formSubmissions")) || [];
    setAllSubmissions(storedSubmissions);
  }, []);

  if (loading) {
    return <p>Loading Form ...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error while Loading form : {error}</p>;
  }

  if (!data) {
    return <p>No Data to show form</p>;
  }

  const validateSubmission = (submissionData) => {
    const { reportId, inputData } = submissionData.data;
    const errors = [];

    if (!inputData?.minId || inputData.minId.trim() === "") {
      errors.push("The field 'minId' cannot be empty.");
    }

    if (!reportId || reportId.trim() === "") {
      errors.push("The field 'reportId' cannot be empty.");
    }

    return errors;
  };


  const handleFormSubmit = (submission) => {
    const errors = validateSubmission(submission);

    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: `<ul>${errors.map((err) => `<li>${err}</li>`).join("")}</ul>`,
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Form Submitted Successfully",
      text: "The form was submitted without any validation errors.",
    }).then(() => {
      if (formRef.current) {
        formRef.current.reset();
      }
    });

    const storedSubmissions =
      JSON.parse(localStorage.getItem("formSubmissions")) || [];

    const updatedSubmissions = [...storedSubmissions, submission.data];

    localStorage.setItem("formSubmissions", JSON.stringify(updatedSubmissions));

    setAllSubmissions(updatedSubmissions);
  };

  const clearFormData = () => {
    localStorage.removeItem("formSubmissions");
    setAllSubmissions([]); 
    Swal.fire({
      icon: "success",
      title: "Data Cleared",
      text: "All form data has been cleared from localStorage.",
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-start">Formio</h1>
      {data ? (
        <Form
          form={data?.data ? JSON.parse(data.data) : {}}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <p>No Data To Show !</p>
      )}

      <div>
        <button className="btn btn-danger mt-4" onClick={clearFormData}>
          Clear All Data
        </button>
      </div>
      <div className="mt-5">
        <h3 className="my-4">Submitted Data</h3>
        {allSubmissions.length > 0 ? (
          <div className="row">
            {allSubmissions.map((submission, index) => (
              <div
                key={index}
                className="col-lg-4 col-md-6 col-12 mb-5" 
              >
                <div className="list-group-item border p-3">
                  <h5 className="mb-1">Submission {index + 1}</h5>
                  <p className="mb-1">
                    <strong>Report ID:</strong> {submission?.reportId}
                  </p>
                  <p className="mb-1">
                    <strong>Min ID:</strong> {submission?.inputData?.minId}
                  </p>
                  <p className="mb-1">
                    <strong>Submit Status:</strong>{" "}
                    {submission?.submit ? "Submitted" : "Not Submitted"}
                  </p>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() =>
                      Swal.fire({
                        title: "Detailed Submission Data",
                        html: `<pre>${JSON.stringify(
                          submission,
                          null,
                          2
                        )}</pre>`,
                        showCloseButton: true,
                        width: "80%",
                      })
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No submissions available.</p>
        )}
      </div>
    </div>
  );
};

export default BpmnViewer;
