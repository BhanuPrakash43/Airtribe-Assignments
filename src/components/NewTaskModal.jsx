import React from "react";
import styles from "./NewTaskModal.module.css";

const NewTaskModal = ({
  setShowModal,
  newTaskName,
  setNewTaskName,
  newTaskDescription,
  setNewTaskDescription,
  handleNewTaskSubmit,
}) => {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "taskName") {
      setNewTaskName(value);
    } else if (name === "taskDescription") {
      setNewTaskDescription(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newTaskName.trim() !== "" && newTaskDescription.trim() !== "") {
      handleNewTaskSubmit();
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
        <h1>Create New Task</h1>

        <form className={styles.formItem} onSubmit={handleSubmit}>
          <input
            type="text"
            id="taskName"
            placeholder="Enter title"
            name="taskName"
            value={newTaskName}
            onChange={handleInputChange}
            required
          />
          <textarea
            placeholder="Enter description"
            id="taskDescription"
            name="taskDescription"
            value={newTaskDescription}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;