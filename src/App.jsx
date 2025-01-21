import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: newPriority,
        dueDate: newDueDate,
      },
    ]);
    setNewTask("");
    setNewDueDate("");
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const changePriority = (taskId, newPriority) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      )
    );
  };

  const changeDueDate = (taskId, newDueDate) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: newDueDate } : task
      )
    );
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityDiff !== 0) return priorityDiff;

      // Then sort by due date
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  return (
    <div className="app-container">
      <h1>Task Master</h1>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="priority-select"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="date-input"
        />
        <button type="submit" className="add-button">
          Add Task
        </button>
      </form>

      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${
              task.completed ? "completed" : ""
            } priority-${task.priority} ${
              isOverdue(task.dueDate) ? "overdue" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <div className="task-content">
              <span>{task.text}</span>
              {task.dueDate && (
                <span className="due-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <select
              value={task.priority}
              onChange={(e) => changePriority(task.id, e.target.value)}
              className="priority-select"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input
              type="date"
              value={task.dueDate || ""}
              onChange={(e) => changeDueDate(task.id, e.target.value)}
              className="date-input"
            />
            <button
              onClick={() => deleteTask(task.id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
