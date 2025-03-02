import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button, Form, ListGroup, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTasks, setEditingTasks] = useState({});
  const [editTexts, setEditTexts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback(() => {
    if (task.trim()) {
      setTasks((prev) => [...prev, { text: task, completed: false }]);
      setTask("");
    }
  }, [task]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") addTask();
  }, [addTask]);

  const deleteTask = useCallback((index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleTask = useCallback((index) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const editTask = useCallback((index) => {
    setEditingTasks((prev) => ({ ...prev, [index]: true }));
    setEditTexts((prev) => ({ ...prev, [index]: tasks[index].text }));
  }, [tasks]);

  const saveTask = useCallback((index) => {
    if (editTexts[index].trim()) {
      setTasks((prev) =>
        prev.map((t, i) => (i === index ? { ...t, text: editTexts[index] } : t))
      );
      setEditingTasks((prev) => ({ ...prev, [index]: false }));
    }
  }, [editTexts]);

  const cancelEdit = useCallback((index) => {
    setEditingTasks((prev) => ({ ...prev, [index]: false }));
    setEditTexts((prev) => ({ ...prev, [index]: tasks[index].text }));
  }, [tasks]);

  const handleEditChange = useCallback((index, value) => {
    setEditTexts((prev) => ({ ...prev, [index]: value }));
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) =>
        filter === "completed" ? t.completed : filter === "pending" ? !t.completed : true
      )
      .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, filter, search]);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filteredTasks.slice(startIndex, startIndex + tasksPerPage);
  }, [filteredTasks, currentPage]);

  return (
    <Container className="mt-4">
      <h2 className="text-center">Enhanced To-Do List</h2>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a task"
            aria-label="Task input"
          />
        </Col>
        <Col md={4}>
          <Button onClick={addTask} variant="primary" disabled={!task.trim()} block>
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
            aria-label="Search tasks"
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          {["all", "completed", "pending"].map((f) => (
            <Button
              key={f}
              variant={f === "completed" ? "success" : f === "pending" ? "warning" : "secondary"}
              onClick={() => setFilter(f)}
              className="me-2"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </Col>
      </Row>

      <ListGroup>
        {paginatedTasks.length > 0 ? (
          paginatedTasks.map((t, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {editingTasks[index] ? (
                <>
                  <Form.Control
                    type="text"
                    value={editTexts[index]}
                    onChange={(e) => handleEditChange(index, e.target.value)}
                  />
                  <div className="ms-2">
                    <Button variant="success" size="sm" onClick={() => saveTask(index)} className="me-1">
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => cancelEdit(index)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                    {t.text}
                  </span>
                  <div>
                    <Button variant="info" size="sm" onClick={() => editTask(index)} className="me-1">
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteTask(index)} className="me-1">
                      Delete
                    </Button>
                    <Button variant={t.completed ? "secondary" : "success"} size="sm" onClick={() => toggleTask(index)}>
                      {t.completed ? "Undo" : "Complete"}
                    </Button>
                  </div>
                </>
              )}
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-center text-muted">No tasks found</p>
        )}
      </ListGroup>

      <Row className="mt-3 justify-content-center">
        <Col md={6} className="text-center">
          <Button variant="secondary" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="mx-2">Page {currentPage} of {totalPages}</span>
          <Button variant="secondary" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoList;