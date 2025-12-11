export default function DeleteButton({ onDelete, selectedIds }) {
    return (
        <button
            onClick={() => onDelete(selectedIds)}
            disabled={selectedIds.length === 0}
        >
            Delete Selected ({selectedIds.length})
        </button>
    );
}