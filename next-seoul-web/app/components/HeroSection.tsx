const heroItems = [
  { label: "친환경 활동" },
  { label: "탄소중립" },
  { label: "그린캠퍼스" },
];

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-[600px] bg-[#D9D9D9] overflow-hidden"
      aria-label="히어로 배너"
    >
      {/* 마스크된 배경 이미지 - 실제 이미지로 대체 필요 */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary to-primary">
        {/* 여기에 정문광장 이미지가 들어갈 예정 */}
      </div>

      {/* 콘텐츠 오버레이 */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            서울대학교 탄소중립
          </h1>
          <div className="flex justify-center gap-6 mt-12">
            {heroItems.map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="w-24 h-24 rounded-full bg-white bg-opacity-20 mx-auto mb-4"
                  role="img"
                  aria-label={`${item.label} 아이콘`}
                ></div>
                <p className="text-lg font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
