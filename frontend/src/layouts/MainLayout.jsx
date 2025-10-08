export default function MainLayout({ children }) {
  return (
    <div className="bg-[#f7f6ef] min-h-screen flex flex-col items-center justify-center">
      {children}
    </div>
  );
}
