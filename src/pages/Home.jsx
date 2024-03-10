import { useEffect, useState } from "react";
import ListTask from "../components/ListTask";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem("tasks")));
  }, []);

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ListTask tasks={tasks} setTasks={setTasks} />
        </div>
      </DndProvider>
    </div>
  );
}
export default Home;
