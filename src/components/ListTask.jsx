import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import NewTaskModal from "./NewTaskModal";
import EditTaskModal from "./EditTaskModal";
import styles from "./ListTask.module.css";

// Import statements...

function ListTask({ tasks, setTasks }) {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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

  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setShowEditTaskModal(true);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

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

      setShowNewTaskModal(false);
      setNewTaskName("");
      setNewTaskDescription("");
      setNewTaskStatus("");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "5em" }}>
      <Section
        status="todo"
        tasks={tasks}
        setTasks={setTasks}
        todos={todos}
        openEditTaskModal={openEditTaskModal}
        setShowNewTaskModal={setShowNewTaskModal}
        handleNewTaskSubmit={handleNewTaskSubmit}
        setNewTaskName={setNewTaskName}
        setNewTaskDescription={setNewTaskDescription}
        setNewTaskStatus={setNewTaskStatus}
      />
      <Section
        status="inprogress"
        tasks={tasks}
        setTasks={setTasks}
        inProgress={inProgress}
        openEditTaskModal={openEditTaskModal}
        setShowNewTaskModal={setShowNewTaskModal}
        handleNewTaskSubmit={handleNewTaskSubmit}
        setNewTaskName={setNewTaskName}
        setNewTaskDescription={setNewTaskDescription}
        setNewTaskStatus={setNewTaskStatus}
      />
      <Section
        status="closed"
        tasks={tasks}
        setTasks={setTasks}
        closed={closed}
        openEditTaskModal={openEditTaskModal}
        setShowNewTaskModal={setShowNewTaskModal}
        handleNewTaskSubmit={handleNewTaskSubmit}
        setNewTaskName={setNewTaskName}
        setNewTaskDescription={setNewTaskDescription}
        setNewTaskStatus={setNewTaskStatus}
      />
      {showNewTaskModal && (
        <NewTaskModal
          setShowModal={setShowNewTaskModal}
          handleNewTaskSubmit={handleNewTaskSubmit}
          setNewTaskName={setNewTaskName}
          setNewTaskDescription={setNewTaskDescription}
          setNewTaskStatus={setNewTaskStatus}
        />
      )}
      {showEditTaskModal && (
        <EditTaskModal
          setShowModal={setShowEditTaskModal}
          task={selectedTask}
          handleTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}

export default ListTask;

// Section, Header, and Task components...


const Section = ({
  status,
  tasks,
  setTasks,
  todos,
  inProgress,
  closed,
  openEditTaskModal,
  setShowNewTaskModal,
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
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, status } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
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
          <Task
            key={task.id}
            task={task}
            tasks={tasks}
            setTasks={setTasks}
            openEditTaskModal={openEditTaskModal}
          />
        ))}

      <button
        onClick={() => setShowNewTaskModal(true)}
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

const Task = ({ task, tasks, setTasks, openEditTaskModal }) => {
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
        <button
          onClick={() => openEditTaskModal(task)}
          className={styles.EditButton}
        >
          Edit
        </button>
        <button
          onClick={() => handleRemove(task.id)}
          className={styles.DeleteButton}
        >
          Del
        </button>
      </div>
    </div>
  );
};
