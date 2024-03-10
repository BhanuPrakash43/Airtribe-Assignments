import React, { useState } from "react";
import styles from "./NewTaskModal.module.css";

const EditTaskModal = ({ setShowModal, task, handleTaskUpdate }) => {
  const [updatedTaskName, setUpdatedTaskName] = useState(task.name);
  const [updatedTaskDescription, setUpdatedTaskDescription] = useState(
    task.description
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "taskName") {
      setUpdatedTaskName(value);
    } else if (name === "taskDescription") {
      setUpdatedTaskDescription(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (updatedTaskName.trim() !== "" && updatedTaskDescription.trim() !== "") {
      handleTaskUpdate({
        ...task,
        name: updatedTaskName,
        description: updatedTaskDescription,
      });
      setShowModal(false);
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button
          type="button"
          className={styles.close}
          aria-label="Close"
          onClick={() => setShowModal(false)}
        >
          X
        </button>
        <h1>Update Your Task</h1>

        <form className={styles.formItem} onSubmit={handleSubmit}>
          <input
            type="text"
            id="taskName"
            placeholder="Enter title"
            name="taskName"
            value={updatedTaskName}
            onChange={handleInputChange}
            required
          />
          <textarea
            placeholder="Enter description"
            id="taskDescription"
            name="taskDescription"
            value={updatedTaskDescription}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Update Task</button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
