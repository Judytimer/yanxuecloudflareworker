interface ChatButtonProps {
  onClick: () => void;
}

export default function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-chat flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-105 z-40"
      aria-label="打开聊天窗口"
    >
      <span className="text-2xl">💬</span>
    </button>
  );
}

