interface HeaderProps {
  onOpenChat: () => void;
}

export default function Header({ onOpenChat }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-card z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-xl font-bold text-primary">Antech</div>
        </div>
        <button
          onClick={onOpenChat}
          className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
        >
          开始对话
        </button>
      </div>
    </header>
  );
}

