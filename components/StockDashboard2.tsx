"use client";

import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Activity, Users, Building, Globe, LucideIcon } from "lucide-react";
import { createChart, CandlestickData } from "lightweight-charts";
// @ts-ignore
import { dummyStockData } from "./data.js";

// 타입 정의
interface StockDataItem {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ShareholderDataItem {
  date: string;
  percentage: number;
  volume: number;
}

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  color: string;
}

interface PeriodButtonProps {
  period: string;
  active: boolean;
  onClick: (period: string) => void;
}

// Lightweight Charts 캔들스틱 차트 컴포넌트 (v5 공식 방식)
const CandlestickChart = ({ data }: { data: any[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart: any = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#111827" }, textColor: "#9CA3AF" },
      grid: { vertLines: { color: "#374151" }, horzLines: { color: "#374151" } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#374151" },
      timeScale: { borderColor: "#374151", timeVisible: true, secondsVisible: false },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#ef4444",
      downColor: "#10b981",
      borderDownColor: "#10b981",
      borderUpColor: "#ef4444",
      wickDownColor: "#9CA3AF",
      wickUpColor: "#9CA3AF",
    });

    const chartData: CandlestickData[] = data.map((item) => ({
      time: Math.floor(new Date(item.date).getTime() / 1000), // 👈 초 단위 timestamp
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candlestickSeries.setData(chartData);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: "400px" }}
    />
  );
};

const StockDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filterDataByPeriod = (data: (StockDataItem | ShareholderDataItem)[], period: string) => {
    const currentYear = 2024;
    const currentMonth = 7;

    switch (period) {
      case "6M":
        return data.filter((item) => {
          const [year, month] = item.date.split("-").map(Number);
          return year === currentYear && month >= currentMonth - 6;
        });
      case "1Y":
        return data.filter((item) => {
          const [year] = item.date.split("-").map(Number);
          return year >= currentYear - 1;
        });
      case "2Y":
        return data.filter((item) => {
          const [year] = item.date.split("-").map(Number);
          return year >= currentYear - 2;
        });
      case "5Y":
      default:
        return data;
    }
  };

  const stockData = filterDataByPeriod(dummyStockData.주가, selectedPeriod) as StockDataItem[];
  const individualData = filterDataByPeriod(dummyStockData.개인, selectedPeriod) as ShareholderDataItem[];
  const foreignData = filterDataByPeriod(dummyStockData.외국인, selectedPeriod) as ShareholderDataItem[];
  const institutionalData = filterDataByPeriod(dummyStockData.기관, selectedPeriod) as ShareholderDataItem[];

  const currentPrice = stockData.length > 0 ? stockData[stockData.length - 1].close : 0;
  const previousPrice = stockData.length > 1 ? stockData[stockData.length - 2].close : 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

  const PeriodButton: React.FC<PeriodButtonProps> = ({ period, active, onClick }) => (
    <button
      onClick={() => onClick(period)}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
        active ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}>
      {period}
    </button>
  );

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => (
    <div className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-gray-400 text-sm'>{title}</p>
          <p className='text-2xl font-bold text-white mt-1'>{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className='ml-1 text-sm'>{Math.abs(change).toFixed(2)}%</span>
            </div>
          )}
        </div>
        <Icon className={`${color} w-8 h-8`} />
      </div>
    </div>
  );

  if (!isClient) {
    return <div className='min-h-screen bg-black text-white flex items-center justify-center'>로딩 중...</div>;
  }

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Header */}
      <header className='bg-gray-900 border-b border-gray-800 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Activity className='text-red-600 w-8 h-8' />
            <h1 className='text-2xl font-bold'>StockFlix</h1>
          </div>
          <nav className='flex space-x-6'>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'>
              대시보드
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'>
              포트폴리오
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'>
              뉴스
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'>
              분석
            </a>
          </nav>
        </div>
      </header>

      <div className='max-w-7xl mx-auto p-6'>
        {/* 주요 지표 */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <StatCard
            title='현재가'
            value={`₩${currentPrice.toLocaleString()}`}
            change={priceChangePercent}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='개인 보유율'
            value={individualData.length > 0 ? `${individualData[individualData.length - 1].percentage}%` : "0%"}
            icon={Users}
            color='text-blue-500'
          />
          <StatCard
            title='외국인 보유율'
            value={foreignData.length > 0 ? `${foreignData[foreignData.length - 1].percentage}%` : "0%"}
            icon={Globe}
            color='text-green-500'
          />
          <StatCard
            title='기관 보유율'
            value={institutionalData.length > 0 ? `${institutionalData[institutionalData.length - 1].percentage}%` : "0%"}
            icon={Building}
            color='text-purple-500'
          />
        </div>

        {/* 기간 선택 버튼 */}
        <div className='flex space-x-2 mb-6'>
          {["6M", "1Y", "2Y", "5Y"].map((period) => (
            <PeriodButton
              key={period}
              period={period}
              active={selectedPeriod === period}
              onClick={setSelectedPeriod}
            />
          ))}
        </div>

        {/* 차트 그리드 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 주가 차트 */}
          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800 lg:col-span-2'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Activity className='text-red-600 mr-2' />
              주가 차트 (캔들스틱) - 확대/축소, 드래그 지원
            </h3>
            <div className='h-96'>
              <CandlestickChart data={stockData} />
            </div>
          </div>

          {/* 개인 매집 현황 */}
          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Users className='text-blue-500 mr-2' />
              개인 보유 현황
            </h3>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'>
                <LineChart data={individualData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='#374151'
                  />
                  <XAxis
                    dataKey='date'
                    stroke='#9CA3AF'
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke='#9CA3AF'
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "보유율"]}
                  />
                  <Line
                    type='monotone'
                    dataKey='percentage'
                    stroke='#3b82f6'
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 외국인 매집 현황 */}
          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Globe className='text-green-500 mr-2' />
              외국인 보유 현황
            </h3>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'>
                <LineChart data={foreignData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='#374151'
                  />
                  <XAxis
                    dataKey='date'
                    stroke='#9CA3AF'
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    stroke='#9CA3AF'
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "보유율"]}
                  />
                  <Line
                    type='monotone'
                    dataKey='percentage'
                    stroke='#10b981'
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 기관 매집 현황 */}
          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800 lg:col-span-2'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Building className='text-purple-500 mr-2' />
              기관 보유 현황
            </h3>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'>
                <LineChart data={institutionalData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='#374151'
                  />
                  <XAxis
                    dataKey='date'
                    stroke='#9CA3AF'
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke='#9CA3AF'
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "보유율"]}
                  />
                  <Line
                    type='monotone'
                    dataKey='percentage'
                    stroke='#8b5cf6'
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
