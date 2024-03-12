import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import NewTaskModal from "./NewTaskModal";
import EditTaskModal from "./EditTaskModal";
import styles from "./ListTask.module.css";

function ListTask({ tasks, setTasks }) {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");

  useEffect(() => {
    if (!Array.isArray(tasks)) return;

    const fTodos = tasks.filter((task) => task.status === "todo");
    const fInProgress = tasks.filter((task) => task.status === "inprogress");
    const fClosed = tasks.filter((task) => task.status === "closed");

    setTodos(fTodos);
    setInProgress(fInProgress);
    setClosed(fClosed);
  }, [tasks]);

  const statuses = ["todo", "inprogress", "closed"];

  const handleNewTaskSubmit = () => {
    if (newTaskName && newTaskDescription && newTaskStatus) {
      const newTask = {
        id: uuidv4(),
        name: newTaskName,
        description: newTaskDescription,
        status: newTaskStatus,
      };

      setTasks((prev) => {
        const updatedTasks = [...prev, newTask];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        return updatedTasks;
      });

      setShowModal(false);
      setNewTaskName("");
      setNewTaskDescription("");
      setNewTaskStatus("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "5em",
      }}
    >
      {statuses.map((status, index) => (
        <Section
          key={index}
          status={status}
          tasks={tasks}
          setTasks={setTasks}
          todos={todos}
          inProgress={inProgress}
          closed={closed}
          setShowModal={setShowModal}
          setNewTaskStatus={setNewTaskStatus}
        />
      ))}
      {showModal && (
        <NewTaskModal
          setShowModal={setShowModal}
          newTaskName={newTaskName}
          setNewTaskName={setNewTaskName}
          newTaskDescription={newTaskDescription}
          setNewTaskDescription={setNewTaskDescription}
          newTaskStatus={newTaskStatus}
          handleNewTaskSubmit={handleNewTaskSubmit}
        />
      )}
    </div>
  );
}

export default ListTask;

const Section = ({
  status,
  tasks,
  setTasks,
  todos,
  inProgress,
  closed,
  setShowModal,
  setNewTaskStatus,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => addItemToSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  let text = "Todo";
  let bg = "grey";
  let taskToMap = todos;

  if (status === "inprogress") {
    text = "In Progress";
    bg = "blue";
    taskToMap = inProgress;
  }
  if (status === "closed") {
    text = "Closed";
    bg = "green";
    taskToMap = closed;
  }

  const addItemToSection = (id) => {
    setTasks((prev) => {
      if (!Array.isArray(prev)) return prev;

      const modtasks = prev.map((task) => {
        if (task.id === id) {
          return { ...task, status: status };
        }
        return task;
      });
      localStorage.setItem("tasks", JSON.stringify(modtasks));
      return modtasks;
    });
  };

  return (
    <div
      ref={drop}
      className={styles.Section}
      style={{
        backgroundColor: isOver ? "whitesmoke" : "",
        borderRadius: "10px",
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header text={text} bg={bg} count={taskToMap.length} />

      {taskToMap.length > 0 &&
        taskToMap.map((task) => (
          <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}

      <button
        onClick={() => {
          setShowModal(true);
          setNewTaskStatus(status);
        }}
        className={styles.NewTaskButton}
      >
        New Task
      </button>
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div style={{ backgroundColor: bg }} className={styles.Header}>
      {text}{" "}
      <span
        style={{
          backgroundColor: "white",
          color: "black",
          padding: "5px 10px",
          borderRadius: "80%",
        }}
      >
        {count}
      </span>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleRemove = (id) => {
    if (!Array.isArray(tasks)) return;

    const fTasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(fTasks));
    setTasks(fTasks);
  };

  // State to manage the visibility of the edit modal
  const [showEditModal, setShowEditModal] = useState(false);

  // Function to open the edit modal
  const handleEdit = () => {
    setShowEditModal(true);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 8px",
        alignItems: "center",
        backgroundColor: "whitesmoke",
        borderRadius: "10px",
        marginBottom: "1em",
      }}
    >
      <p style={{ margin: 0, fontSize: "1.1em" }}>{task.name}</p>

      <div className={styles.delUpdate}>
        <button onClick={handleEdit} className={styles.EditButton}>
          Edit
        </button>
        <button onClick={() => handleRemove(task.id)} className={styles.DeleteButton}>
          Del
        </button>
      </div>

      {/* Render EditTaskModal if showEditModal is true */}
      {showEditModal && (
        <EditTaskModal
          setShowModal={setShowEditModal}
          task={task}
          handleTaskUpdate={(updatedTask) => {
            // Handle updating the task here
            // Update the task in the tasks array
            const updatedTasks = tasks.map((t) =>
              t.id === updatedTask.id ? updatedTask : t
            );
            setTasks(updatedTasks);
            // You may also want to update localStorage here
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
          }}
        />
      )}
    </div>
  );
};

// export default Task;