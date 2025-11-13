interface HeroSectionProps {
  onOpenChat: () => void;
}

export default function HeroSection({ onOpenChat }: HeroSectionProps) {
  return (
    <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-primary-light to-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="mb-6 text-neutral-dark">
          找到学习的乐趣
        </h1>
        <p className="text-xl mb-8 text-neutral-medium">
          与AI导师对话，重新发现学习的意义
        </p>
        <p className="mb-10 text-neutral-medium">
          我们理解你在学习上遇到的困难，用温和的方式帮助你重新找到学习的动力
        </p>
        <button
          onClick={onOpenChat}
          className="px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors shadow-hover"
        >
          开始对话
        </button>
      </div>
    </section>
  );
}

