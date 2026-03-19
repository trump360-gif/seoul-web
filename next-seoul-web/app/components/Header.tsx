"use client";

const navItems = [
  { label: "온실가스", href: "/greenhouse-gas", active: true },
  { label: "에너지", href: "/energy", active: false },
  { label: "그린캠퍼스", href: "/green-campus", active: false },
  { label: "그린아카이브", href: "/green-archive", active: false },
  { label: "탄소중립연구자 네트워크", href: "/network", active: false },
];

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white">
      <div className="flex items-center gap-3">
        {/* 로고 자리 */}
        <div
          className="h-10 w-10 bg-primary rounded-sm"
          role="img"
          aria-label="서울대학교 탄소중립캠퍼스 로고"
        ></div>
        <div>
          <h1 className="font-extrabold text-[28px] leading-tight text-primary">
            서울대학교 탄소중립캠퍼스
          </h1>
          <p className="text-[16px] text-primary">
            Carbon Neutral Campus Initiative
          </p>
        </div>
      </div>

      <nav className="hidden lg:flex gap-12" aria-label="메인 내비게이션">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={
              item.active
                ? "text-primary font-extrabold text-[28px] border-b-2 border-primary"
                : "text-[#424443] font-semibold text-[26px] hover:text-secondary"
            }
            aria-current={item.active ? "page" : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
