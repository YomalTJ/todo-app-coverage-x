const TaskCard = ({ task, onToggleComplete }) => {
  return (
    <div className="bg-[#d6d6d6] p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">{task.title}</h3>
          <p className="text-gray-700">{task.description}</p>
        </div>
        <button
          onClick={() => onToggleComplete(task.id)}
          className="bg-transparent border border-gray-700 text-gray-700 px-4 md:px-8 py-1 rounded hover:bg-gray-100 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
