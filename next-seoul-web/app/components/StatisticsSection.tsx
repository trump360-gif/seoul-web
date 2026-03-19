interface StatCard {
  unit: string;
  value: string;
  year: string;
  label: string;
}

const statCards: StatCard[] = [
  {
    unit: "단위 t(톤)",
    value: "144,448",
    year: "2022년 연간 기준",
    label: "온실가스 전체 배출량",
  },
  {
    unit: "단위 TOE(석유환산톤)",
    value: "43,106",
    year: "2023년 연간 기준",
    label: "에너지 전체 소비량",
  },
  {
    unit: "단위 kWh(킬로와트시)",
    value: "1,782,921",
    year: "2023년 연간 기준",
    label: "태양광 전체 발전량",
  },
  {
    unit: "단위 t(톤)",
    value: "830",
    year: "2023년 연간 기준",
    label: "온실가스 감축효과",
  },
];

export default function StatisticsSection() {
  return (
    <section
      className="w-full py-16 relative bg-primary"
      aria-label="온실가스 및 에너지 통계"
    >
      <div className="absolute top-0 left-0 w-1/2 h-full bg-white rounded-tr-[250px]"></div>
      <div className="container mx-auto relative z-10 text-center">
        <h2 className="text-[60px] font-semibold text-white mb-16">
          온실가스&에너지 한 눈에 보기
        </h2>

        {/* 통계 카드 그리드 */}
        <div className="flex flex-wrap justify-center gap-12">
          {statCards.map((card) => (
            <article
              key={card.label}
              className="bg-white rounded-tl-[70px] p-8 shadow-md w-[280px]"
              aria-label={`${card.label}: ${card.value}`}
            >
              <p className="text-[#8E8E8E] text-lg">{card.unit}</p>
              <p className="text-primary text-5xl font-bold my-2">
                {card.value}
              </p>
              <p className="text-[#8E8E8E] text-lg mb-2">{card.year}</p>
              <p className="text-[#424443] text-2xl font-medium">
                {card.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
