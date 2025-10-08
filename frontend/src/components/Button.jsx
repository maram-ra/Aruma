export default function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-4 bg-white rounded-xl shadow-md text-[#5a302b] font-medium hover:shadow-lg transition ${className}`}
    >
      {children}
    </button>
  );
}
