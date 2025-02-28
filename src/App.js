import React, { useState } from "react";
import { Button, Form, ListGroup, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask("");
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index) => {
    setEditingTask(index);
    setEditText(tasks[index].text);
  };

  const saveTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editText;
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  }).filter(task => task.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container className="mt-4">
      <h2 className="text-center">Simple To-Do List</h2>
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
          />
        </Col>
        <Col md={4}>
          <Button onClick={addTask} variant="primary" block>
            Add Task
          </Button>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button variant="secondary" onClick={() => setFilter("all")}>All</Button>{" "}
          <Button variant="success" onClick={() => setFilter("completed")}>Completed</Button>{" "}
          <Button variant="warning" onClick={() => setFilter("pending")}>Pending</Button>
        </Col>
      </Row>
      <ListGroup>
        {filteredTasks.map((task, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            {editingTask === index ? (
              <Form.Control
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                {task.text}
              </span>
            )}
            <div>
              {editingTask === index ? (
                <Button variant="success" size="sm" onClick={() => saveTask(index)}>
                  Save
                </Button>
              ) : (
                <>
                  <Button variant="info" size="sm" onClick={() => editTask(index)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => deleteTask(index)}>
                    Delete
                  </Button>{" "}
                  <Button variant={task.completed ? "secondary" : "success"} size="sm" onClick={() => toggleTask(index)}>
                    {task.completed ? "Undo" : "Complete"}
                  </Button>
                </>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default TodoList;
