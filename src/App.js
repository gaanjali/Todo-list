import React, { useState, useCallback, useMemo } from "react";
import { Button, Form, ListGroup, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [search, setSearch] = useState("");

  const addTask = useCallback(() => {
    if (task.trim()) {
      setTasks((prevTasks) => [...prevTasks, { text: task, completed: false }]);
      setTask("");
    }
  }, [task]);

  const deleteTask = useCallback((index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  }, []);

  const editTask = useCallback((index) => {
    setEditingTask(index);
    setEditText(tasks[index].text);
  }, [tasks]);

  const saveTask = useCallback((index) => {
    setTasks((prevTasks) =>
      prevTasks.map((t, i) => (i === index ? { ...t, text: editText } : t))
    );
    setEditingTask(null);
  }, [editText]);

  const toggleTask = useCallback((index) => {
    setTasks((prevTasks) =>
      prevTasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => (filter === "completed" ? t.completed : filter === "pending" ? !t.completed : true))
      .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, filter, search]);

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
            placeholder="Seaaaaaarch tasks"
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {["all", "completed", "pending"].map((f) => (
            <Button key={f} variant={f === "completed" ? "success" : f === "pending" ? "warning" : "secondary"} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Col>
      </Row>

      <ListGroup>
        {filteredTasks.map((t, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            {editingTask === index ? (
              <Form.Control type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
            ) : (
              <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                {t.text}
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
                  <Button variant={t.completed ? "secondary" : "success"} size="sm" onClick={() => toggleTask(index)}>
                    {t.completed ? "Undo" : "Complete"}
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
