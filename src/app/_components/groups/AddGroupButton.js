export default function AddGroupButton({ handleAddGroup }) {
  return (
    <button
      className="mt-8 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
      onClick={handleAddGroup}
    >
      Add Group
    </button>
  );
}