import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onToggleComplete }) => {
  return (
    <div className="w-full">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default TaskList;
