import { useState } from 'react';

const AddTaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask({
      title,
      description
    });
    
    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <h2 className="text-xl font-bold mb-4">Add a Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <textarea
            className="w-full border border-gray-300 rounded p-2 h-24"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex md:justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 w-full md:w-1/4 cursor-pointer"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
