import React, { useState, useEffect } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import { auth, db } from "../../../../Firebase"; // Adjust path as necessary
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./style.css";

function PatientData() {
  const { handleIconClick } = useOutletContext();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    // Fetch patient data from Firestore
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "Hospitals", userId, "Patients"));
        const patientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPatients(patientsData);
      } catch (error) {
        setError("Error fetching patients: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [userId]);

  // Handle deleting a patient
  const deletePatient = async (id) => {
    try {
      await deleteDoc(doc(db, "Hospitals", userId, "Patients", id));
      setPatients(patients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error("Error deleting patient: ", error);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    try {
      const birthDate = new Date(dob.split('-').reverse().join('-'));
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    } catch (error) {
      console.error("Error calculating age: ", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="patient-data-container">
      <div className="patient-data-header">
        <h2 className="patient-data-h2" style={{ marginBottom: "0" }}>
          Patient Data
        </h2>
        <FaPlusCircle
          style={{ fontSize: "1.5rem", color: "#4A4A4A", cursor: "pointer" }}
          onClick={handleIconClick}
        />
      </div>
      <table className="patient-data-table">
        <thead className="patient-data-table-head">
          <tr>
            <th className="patient-data-head">Patient Name</th>
            <th className="patient-data-head">Age</th>
            <th className="patient-data-head">Weight</th>
            <th className="patient-data-head">Gender</th>
            <th className="patient-data-head">Actions</th>
          </tr>
        </thead>

        <tbody className="patient-data-table-body">
          {loading ? (
            <tr>
              <td colSpan="5">Loading...</td> {/* Span across all columns */}
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="5">{error}</td> {/* Span across all columns */}
            </tr>
          ) : patients.length === 0 ? (
            <tr>
              <td colSpan="5">No patients found.</td> {/* Span across all columns */}
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id}>
                <td className="patient-data-values-names">{patient.name}</td>
                <td className="patient-data-values">
                  {calculateAge(patient.dob)}
                </td>
                <td className="patient-data-values">{patient.weight}</td>
                <td className="patient-data-values">{patient.gender}</td>
                <td>
                  <button
                    onClick={() => deletePatient(patient.id)}
                    className="patient-data-delete-button"
                  >
                    <MdOutlineDeleteOutline
                      style={{
                        fontSize: "1.7rem",
                        marginTop: "0.5rem",
                        color: "#FF8E26",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PatientData;
