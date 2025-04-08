// App.tsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import QuoteBanner from "./components/QuoteBanner";
import GregorianPlayer from "./components/GregorianPlayer";
import NewsTicker from "./components/News Ticker/NewsTicker";
import { getBibleVerse } from "./services/bibleService";
import { SaintQuotes } from "./data/saintQuotes";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface Task {
  id: number;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  done: boolean;
}

export default function App() {
  const [verse, setVerse] = useState("");
  const [saintQuote, setSaintQuote] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "done">>({
    title: "",
    description: "",
    startDate: "",
    dueDate: ""
  });

  useEffect(() => {
    getBibleVerse().then(setVerse);
    setSaintQuote(SaintQuotes[Math.floor(Math.random() * SaintQuotes.length)]);
    Notification.requestPermission();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  const handleAddTask = () => {
    const newId = Date.now();
    const task = { ...newTask, id: newId, done: false };
    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "", startDate: "", dueDate: "" });
    setShowModal(false);
    scheduleNotification(task);
  };

  const scheduleNotification = (task: Task) => {
    if (Notification.permission === "granted") {
      const due = new Date(task.dueDate).getTime();
      const now = Date.now();
      const delay = due - now;
      if (delay > 0) {
        setTimeout(() => {
          navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
              reg.showNotification("Lembrete de Tarefa", {
                body: `${task.title} - Prazo: ${task.dueDate}`,
                icon: "/icon.png",
              });
            }
          });
        }, delay);
      }
    }
  };

  const toggleTaskDone = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const shareTask = (task: Task) => {
    const text = `Tarefa: ${task.title}\nDescrição: ${task.description}\nInício: ${task.startDate}\nPrazo: ${task.dueDate}`;
    navigator.share ? navigator.share({ text }) : alert(text);
  };

  return (
    <div className="bg-light min-vh-100">
      <NewsTicker />

      <Container className="py-4">
        <h1 className="text-center mb-4">Agenda Católica Moderna</h1>

        <QuoteBanner verse={verse} saintQuote={saintQuote} />
        <GregorianPlayer />

        <Row className="my-4">
          <Col md={6}>
            <Calendar className="rounded shadow" />
          </Col>

          <Col md={6}>
            <Card className="shadow">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <strong>Minhas Tarefas</strong>
                <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>+
                </Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: 300, overflowY: "auto" }}>
                {tasks.map(task => (
                  <Card key={task.id} className="mb-2 border-0 shadow-sm">
                    <Card.Body>
                      <Card.Title>{task.title}</Card.Title>
                      <Card.Text>{task.description}</Card.Text>
                      <small className="text-muted">Início: {task.startDate} | Prazo: {task.dueDate}</small>
                      <div className="mt-2 d-flex gap-2">
                        <Button size="sm" variant="success" onClick={() => toggleTaskDone(task.id)}>
                          {task.done ? "Desfazer" : "Concluir"}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => deleteTask(task.id)}>
                          Excluir
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => shareTask(task)}>
                          Compartilhar
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Tarefa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Título</Form.Label>
              <Form.Control value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Data de Início</Form.Label>
              <Form.Control type="datetime-local" value={newTask.startDate} onChange={e => setNewTask({ ...newTask, startDate: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Data de Conclusão</Form.Label>
              <Form.Control type="datetime-local" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddTask}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
