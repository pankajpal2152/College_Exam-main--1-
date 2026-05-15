import React, { useState } from "react";
import ProfessorForm from "./ProfessorForm";
import ProfessorTable from "./ProfessorTable";

// Initial empty state matching our database schema
const initialFormState = {
    name: "",
    email: "",
    password: "",
    mobile: "",
    designation: "",
    subject: "",
    experience: "",
    bank_name: "",
    branch_name: "",
    ifsc_code: "",
    account_number: "",
    account_holder_name: "",
    bank_address: "",
    roles: [], // Array to hold multiple roles
};

export default function ProfessorManager() {
    // 1. State for the list of professors (Starting with one dummy record for testing)
    const [professors, setProfessors] = useState([
        {
            id: 1,
            name: "Dr. A. Sharma",
            email: "asharma@college.edu",
            password: "hashedpassword",
            mobile: "9876543210",
            designation: "Professor",
            subject: "Computer Science",
            experience: "15 Years",
            roles: ["Head Examiner", "Review Committee"],
        },
    ]);

    // 2. State for the form inputs
    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // 3. Handle standard text inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 4. Handle multiple checkbox selections for roles
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        setFormData((prevData) => {
            // If checked, add to array. If unchecked, filter it out of the array.
            const updatedRoles = checked
                ? [...(prevData.roles || []), value]
                : (prevData.roles || []).filter((role) => role !== value);

            return {
                ...prevData,
                roles: updatedRoles,
            };
        });
    };

    // 5. Handle Form Submission (Create or Update)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // API call to UPDATE would go here
            setProfessors((prev) =>
                prev.map((prof) => (prof.id === editId ? { ...formData, id: editId } : prof))
            );
        } else {
            // API call to CREATE would go here
            const newProfessor = {
                ...formData,
                id: Date.now(), // Simulating an auto-incrementing database ID
            };
            setProfessors((prev) => [...prev, newProfessor]);
        }

        resetForm();
    };

    // 6. Populate form for editing
    const handleEdit = (professor) => {
        // Ensure roles is an array even if undefined in the DB
        setFormData({ ...professor, roles: professor.roles || [] });
        setIsEditing(true);
        setEditId(professor.id);

        // Scroll to top of page so user sees the form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 7. Handle Deletion
    const handleDelete = (id) => {
        // API call to DELETE would go here
        const confirmDelete = window.confirm("Are you sure you want to remove this professor?");
        if (confirmDelete) {
            setProfessors((prev) => prev.filter((prof) => prof.id !== id));
        }
    };

    // 8. Reset the form to initial state
    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.header}>
                <h1 style={styles.title}>Professor Management Hub</h1>
                <p style={styles.subtitle}>Add, update, and assign roles to faculty members.</p>
            </div>

            {/* Render the Form Component */}
            <ProfessorForm
                formData={formData}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                isEditing={isEditing}
            />

            <div style={styles.divider}></div>

            {/* Render the Table Component */}
            <div style={styles.tableSection}>
                <h2 style={styles.sectionTitle}>Registered Faculty Directory</h2>
                <ProfessorTable
                    data={professors}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}

// Simple layout styles to tie the page together beautifully
const styles = {
    pageContainer: {
        padding: "40px",
        backgroundColor: "#f8fafc", // Matches the soft background of your components
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
        marginBottom: "30px",
        textAlign: "center",
    },
    title: {
        fontSize: "28px",
        color: "#1e293b",
        marginBottom: "8px",
        fontWeight: "700",
    },
    subtitle: {
        color: "#64748b",
        fontSize: "15px",
    },
    divider: {
        height: "1px",
        backgroundColor: "#e2e8f0",
        margin: "40px 0",
    },
    tableSection: {
        marginTop: "20px",
    },
    sectionTitle: {
        fontSize: "20px",
        color: "#334155",
        marginBottom: "20px",
        fontWeight: "600",
        paddingLeft: "30px", // Align with table padding
    }
};