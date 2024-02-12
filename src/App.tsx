import React, { useState, useEffect, FunctionComponent } from 'react';
import './App.css';
import Button from './components/ui-kit/button';
import InputText from './components/ui-kit/inputText';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Checkbox from './components/ui-kit/checkbox';

interface Task {
  text: string;
  completed: boolean;
  deadline: string;
}

const App: FunctionComponent = () => {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editedText, setEditedText] = useState('');
  const [isDeadlineOpened, setIsDeadlineOpened] = useState(false);
  const [deadlineIndex, setDeadlineIndex] = useState<Number>();
  const [isDeadlineChecked, setIsDeadlineChecked] = useState(false);
  const [deadlineNewTask, setDeadlineNewTask] = useState('Додати дедлайн');

  useEffect(() => {
    loadTasksFromLocalStorage();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTask) {
      setEditedText(event.target.value);
    } else setTaskInput(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const createTask = (
    taskText: string,
    isCompleted: boolean,
    deadline: string
  ) => {
    const newTask: Task = {
      text: taskText,
      completed: isCompleted,
      deadline: deadline,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const addTask = () => {
    const trimmedText = taskInput.trim();
    if (trimmedText !== 'AMCbridge' && trimmedText !== '') {
      createTask(trimmedText, false, deadlineNewTask);
      setDeadlineNewTask('Додати дедлайн');
      setTaskInput('');
    }
    saveTasksToLocalStorage();
  };

  const toggleTaskStatus = (task: Task) => {
    task.completed = !task.completed;
    setTasks([...tasks]);
    saveTasksToLocalStorage();
  };

  const deleteTask = (task: Task) => {
    const updatedTasks = tasks.filter((t) => t !== task);
    setTasks(updatedTasks);
    saveTasksToLocalStorage();
  };

  const changeTaskDeadline = (date: Date, task: Task) => {
    task.deadline = date.toDateString();
    setTasks([...tasks]);
    saveTasksToLocalStorage();
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setEditedText(task.text);
  };

  const finishEditing: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (
      event.key === 'Enter' &&
      editedText.trim() !== 'AMCbridge' &&
      editedText.trim() !== ''
    ) {
      if (editingTask) {
        editingTask.text = editedText.trim();
        setEditingTask(null);
        editingTask.completed = false;
      }
    }
  };

  const saveTasksToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const tasksJSON = localStorage.getItem('tasks');

    if (tasksJSON) {
      const loadedTasks: Task[] = JSON.parse(tasksJSON);
      setTasks(loadedTasks);
    }
  };

  window.addEventListener('beforeunload', saveTasksToLocalStorage);

  return (
    <div>
      <header>
        <h1>Список справ</h1>
      </header>
      <div className='inputpole'>
        <InputText
          focus={false}
          inputText={'Введіть завдання'}
          id={'taskInput'}
          value={taskInput}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />

        {!isDeadlineChecked ? (
          <Checkbox
            isChecked={isDeadlineChecked}
            onChange={() => setIsDeadlineChecked(!isDeadlineChecked)}
          >
            {deadlineNewTask}
          </Checkbox>
        ) : (
          <DatePicker
            // autoFocus // криво працює (або я криво зробив) =(
            minDate={new Date()}
            maxDate={new Date(2100, 0, 1)}
            format='dd-MM-yyyy'
            disableCalendar={true}
            onChange={(date) => {
              if (date !== null && date instanceof Date && date > new Date()) {
                setDeadlineNewTask(date.toDateString());
              }
              setIsDeadlineChecked(false);
            }}
          />
        )}

        <Button
          buttonText={'Додати'}
          handleClick={addTask}
          disabled={!taskInput.trim()}
        />
      </div>

      <ul>
        {tasks.map((task, index) => (
          <li key={index} className='task'>
            <Checkbox
              isChecked={task.completed}
              onChange={() => toggleTaskStatus(task)}
            />
            <span
              onClick={() => toggleTaskStatus(task)}
              id={`task${task.completed}`}
            >
              {editingTask === task ? (
                <InputText
                  focus={true}
                  inputText={'Введіть завдання'}
                  id={'editTextInput'}
                  value={editedText}
                  onChange={handleInputChange}
                  onKeyDown={finishEditing}
                />
              ) : (
                task.text
              )}
            </span>

            <Button
              buttonText={'Видалити'}
              handleClick={() => deleteTask(task)}
              disabled={false}
              id='deleteButton'
            />

            {isDeadlineOpened && index === deadlineIndex ? (
              <DatePicker
                // autoFocus // криво працює (або я криво зробив) =(
                minDate={new Date()}
                maxDate={new Date(2100, 0, 1)}
                format='dd-MM-yyyy'
                disableCalendar={true}
                onChange={(date) => {
                  setIsDeadlineOpened(false);
                  if (
                    date !== null &&
                    date instanceof Date &&
                    date > new Date()
                  )
                    changeTaskDeadline(date, task);
                }}
              />
            ) : (
              <Button
                buttonText={task.deadline}
                handleClick={() => {
                  setIsDeadlineOpened(true);
                  setDeadlineIndex(index);
                }}
                disabled={false}
                id={''}
              />
            )}

            <Button
              buttonText={'Редагувати'}
              handleClick={() => {
                editTask(task);
              }}
              disabled={false}
              id={''}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
