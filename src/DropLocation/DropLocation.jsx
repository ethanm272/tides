import "./DeleteLocation.css";

export const DropLocation = ({ id, deleteLocation }) => {
  return (
    <button
      type="button"
      className="delete-btn"
      onClick={() => deleteLocation(id)}
    >
      <img
        src="src/assets/icons8-multiply-30.png"
        alt="delete location"
        width="30"
        height="30"
        className="delete-icon"
      />
    </button>
  );
};
