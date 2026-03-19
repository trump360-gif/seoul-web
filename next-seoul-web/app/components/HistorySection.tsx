"use client";

import { useState } from "react";

interface YearData {
  year: string;
  date: string;
  description: string;
}

const yearData: YearData[] = [
  {
    year: "2008",
    date: "2008년 10월",
    description: "지속가능한 친환경 서울대 선언",
  },
  {
    year: "2009",
    date: "2009년 2월",
    description: "지속가능한 친환경 서울대학교 추진방향 연구 보고서 발간",
  },
  {
    year: "2010",
    date: "2010년",
    description: "그린캠퍼스 조성 사업 추진",
  },
  {
    year: "2011",
    date: "2011년",
    description: "캠퍼스 온실가스 인벤토리 구축",
  },
];

export default function HistorySection() {
  const [activeYear, setActiveYear] = useState("2008");

  const activeData = yearData.find((d) => d.year === activeYear);

  return (
    <section className="w-full py-16 bg-white" aria-label="캠퍼스 역사">
      <div className="container mx-auto">
        <h2 className="text-[60px] font-bold text-primary text-center mb-4">
          서울대학교 탄소중립 캠퍼스의 역사
        </h2>
        <p className="text-[36px] text-[#424443] text-center mb-12">
          From sustainable SNU to carbon neutral campus
        </p>

        {/* 슬라이드 컨트롤 */}
        <div
          className="bg-[#F0F0F0] rounded-full max-w-4xl mx-auto py-4 px-8 flex justify-between mb-12"
          role="tablist"
          aria-label="연도별 역사 탭"
        >
          {yearData.map((item) => (
            <button
              key={item.year}
              className={`text-[30px] font-medium ${
                activeYear === item.year
                  ? "text-primary"
                  : "text-[#DDDDDD]"
              }`}
              onClick={() => setActiveYear(item.year)}
              role="tab"
              aria-selected={activeYear === item.year}
              aria-controls={`panel-${item.year}`}
            >
              {item.year}
            </button>
          ))}
        </div>

        {/* 연도별 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {activeData && (
            <div
              id={`panel-${activeData.year}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeData.year}`}
              className="shadow-md rounded-lg overflow-hidden"
            >
              <div className="h-[200px] bg-secondary relative">
                {/* 이미지 대체 (행정관 이미지) */}
                <div
                  className="absolute bottom-0 w-full h-12 bg-white bg-opacity-85"
                  role="img"
                  aria-label={`${activeData.year}년 캠퍼스 이미지`}
                ></div>
              </div>
              <div className="p-6 text-left">
                <h3 className="text-[60px] font-semibold text-[#424443] leading-tight">
                  {activeData.year}
                </h3>
                <div>
                  <p className="text-[22px] font-medium text-[#424443] mb-1">
                    {activeData.date}
                  </p>
                  <p className="text-[19px] text-[#424443]">
                    {activeData.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-[21px] font-light text-[#898989]">
                    see more
                  </span>
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
