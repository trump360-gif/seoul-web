interface CategoryItem {
  label: string;
  icon?: string;
}

const leftCategories: CategoryItem[] = [
  { label: "친환경 학생 활동" },
  { label: "그린리더십" },
  { label: "그린레포트" },
  { label: "인포그래픽" },
  { label: "자료실" },
  { label: "지속가능성 보고서" },
];

const rightCategories: CategoryItem[] = [
  { label: "온실가스 배출량", icon: "CO2" },
  { label: "온실가스 감축활동" },
  { label: "온실가스 맵" },
  { label: "에너지" },
  { label: "태양광 발전" },
  { label: "전력사용량" },
];

function CategoryIcon({ item }: { item: CategoryItem }) {
  return (
    <div
      className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-[#CDE460] flex items-center justify-center mb-3"
      role="img"
      aria-label={`${item.label} 아이콘`}
    >
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
        {item.icon && (
          <span className="text-primary font-medium">
            {item.icon === "CO2" ? (
              <>
                CO<sub>2</sub>
              </>
            ) : (
              item.icon
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  return (
    <section
      className="w-full py-16 relative bg-white"
      aria-label="카테고리 메뉴"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F5FDE7] rounded-bl-[250px]"></div>
      <div className="container mx-auto relative z-10 text-center">
        <h2 className="text-[60px] font-semibold text-primary mb-10">
          지속가능한 친환경 서울대학교
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* 왼쪽 카테고리 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leftCategories.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <CategoryIcon item={item} />
                <p className="text-[22px] font-semibold text-primary">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* 오른쪽 카테고리 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rightCategories.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <CategoryIcon item={item} />
                <p className="text-[22px] font-semibold text-primary">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
