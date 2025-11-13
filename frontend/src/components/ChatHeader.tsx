interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="h-14 bg-primary-light border-b border-neutral-light px-4 flex items-center justify-between rounded-t-xl">
      <div className="flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <span className="font-semibold text-neutral-dark">AI学习伙伴</span>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center text-neutral-medium hover:text-neutral-dark transition-colors"
        aria-label="关闭聊天窗口"
      >
        ×
      </button>
    </div>
  );
}

