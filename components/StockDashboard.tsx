"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Activity, Users, Building, Globe, LucideIcon } from "lucide-react";
import Header from "./Header";

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

// 간단한 JSON 구조의 더미 데이터
const dummyStockData = {
  주가: [
    { date: "2020-01", price: 48500, open: 48000, high: 49200, low: 47800, close: 48500 },
    { date: "2020-04", price: 52600, open: 49800, high: 53400, low: 48900, close: 52600 },
    { date: "2020-07", price: 56800, open: 53100, high: 57600, low: 52800, close: 56800 },
    { date: "2020-10", price: 57300, open: 58900, high: 60200, low: 56800, close: 57300 },
    { date: "2021-01", price: 63800, open: 61200, high: 64600, low: 60800, close: 63800 },
    { date: "2021-04", price: 72400, open: 68900, high: 74200, low: 67800, close: 72400 },
    { date: "2021-07", price: 84700, open: 78900, high: 86200, low: 78100, close: 84700 },
    { date: "2021-10", price: 88900, open: 83600, high: 91400, low: 83200, close: 88900 },
    { date: "2022-01", price: 86400, open: 89700, high: 91200, low: 84800, close: 86400 },
    { date: "2022-04", price: 81600, open: 78800, high: 83200, low: 77900, close: 81600 },
    { date: "2022-07", price: 78600, open: 74900, high: 80200, low: 74200, close: 78600 },
    { date: "2022-10", price: 76800, open: 79200, high: 80600, low: 75100, close: 76800 },
    { date: "2023-01", price: 87600, open: 84200, high: 89400, low: 83800, close: 87600 },
    { date: "2023-04", price: 94200, open: 88900, high: 96100, low: 88300, close: 94200 },
    { date: "2023-07", price: 99600, open: 95400, high: 101800, low: 94900, close: 99600 },
    { date: "2023-10", price: 97200, open: 93800, high: 99400, low: 93200, close: 97200 },
    { date: "2024-01", price: 107900, open: 104300, high: 109800, low: 103900, close: 107900 },
    { date: "2024-04", price: 113500, open: 109800, high: 115900, low: 109200, close: 113500 },
    { date: "2024-07", price: 118900, open: 116200, high: 121300, low: 115600, close: 118900 },
  ],
  개인: [
    { date: "2020-01", percentage: 58.2, volume: 145000000 },
    { date: "2020-04", percentage: 57.9, volume: 139000000 },
    { date: "2020-07", percentage: 57.4, volume: 140000000 },
    { date: "2020-10", percentage: 57.9, volume: 144000000 },
    { date: "2021-01", percentage: 56.8, volume: 137000000 },
    { date: "2021-04", percentage: 56.3, volume: 134000000 },
    { date: "2021-07", percentage: 55.8, volume: 131000000 },
    { date: "2021-10", percentage: 56.0, volume: 132000000 },
    { date: "2022-01", percentage: 56.5, volume: 136000000 },
    { date: "2022-04", percentage: 57.1, volume: 140000000 },
    { date: "2022-07", percentage: 57.8, volume: 144000000 },
    { date: "2022-10", percentage: 58.2, volume: 147000000 },
    { date: "2023-01", percentage: 57.1, volume: 139000000 },
    { date: "2023-04", percentage: 56.7, volume: 136000000 },
    { date: "2023-07", percentage: 56.2, volume: 135000000 },
    { date: "2023-10", percentage: 56.5, volume: 136000000 },
    { date: "2024-01", percentage: 55.4, volume: 130000000 },
    { date: "2024-04", percentage: 54.9, volume: 127000000 },
    { date: "2024-07", percentage: 54.3, volume: 123000000 },
  ],
  외국인: [
    { date: "2020-01", percentage: 28.4, volume: 71000000 },
    { date: "2020-04", percentage: 28.5, volume: 72000000 },
    { date: "2020-07", percentage: 30.2, volume: 83000000 },
    { date: "2020-10", percentage: 29.7, volume: 79000000 },
    { date: "2021-01", percentage: 31.2, volume: 90000000 },
    { date: "2021-04", percentage: 31.7, volume: 95000000 },
    { date: "2021-07", percentage: 32.2, volume: 99000000 },
    { date: "2021-10", percentage: 32.0, volume: 98000000 },
    { date: "2022-01", percentage: 31.5, volume: 94000000 },
    { date: "2022-04", percentage: 30.9, volume: 89000000 },
    { date: "2022-07", percentage: 30.2, volume: 85000000 },
    { date: "2022-10", percentage: 29.8, volume: 82000000 },
    { date: "2023-01", percentage: 30.9, volume: 90000000 },
    { date: "2023-04", percentage: 31.3, volume: 94000000 },
    { date: "2023-07", percentage: 31.8, volume: 98000000 },
    { date: "2023-10", percentage: 31.5, volume: 96000000 },
    { date: "2024-01", percentage: 32.6, volume: 106000000 },
    { date: "2024-04", percentage: 33.1, volume: 111000000 },
    { date: "2024-07", percentage: 33.7, volume: 117000000 },
  ],
  기관: [
    { date: "2020-01", percentage: 13.4, volume: 33500000 },
    { date: "2020-04", percentage: 13.6, volume: 34200000 },
    { date: "2020-07", percentage: 12.4, volume: 31000000 },
    { date: "2020-10", percentage: 12.4, volume: 31000000 },
    { date: "2021-01", percentage: 12.0, volume: 29000000 },
    { date: "2021-04", percentage: 12.0, volume: 28500000 },
    { date: "2021-07", percentage: 12.0, volume: 28800000 },
    { date: "2021-10", percentage: 12.0, volume: 29200000 },
    { date: "2022-01", percentage: 12.0, volume: 28800000 },
    { date: "2022-04", percentage: 12.0, volume: 28500000 },
    { date: "2022-07", percentage: 12.0, volume: 28200000 },
    { date: "2022-10", percentage: 12.0, volume: 28800000 },
    { date: "2023-01", percentage: 12.0, volume: 28400000 },
    { date: "2023-04", percentage: 12.0, volume: 28200000 },
    { date: "2023-07", percentage: 12.0, volume: 28500000 },
    { date: "2023-10", percentage: 12.0, volume: 28800000 },
    { date: "2024-01", percentage: 12.0, volume: 28200000 },
    { date: "2024-04", percentage: 12.0, volume: 27800000 },
    { date: "2024-07", percentage: 12.0, volume: 27500000 },
  ],
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

  const currentPrice = stockData.length > 0 ? stockData[stockData.length - 1].price : 0;
  const previousPrice = stockData.length > 1 ? stockData[stockData.length - 2].price : 0;
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
      <Header chartType='rechart' />

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
              주가 차트
            </h3>
            <div className='h-96'>
              <ResponsiveContainer
                width='100%'
                height='100%'>
                <LineChart data={stockData}>
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
                    tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value, name) => [`₩${value.toLocaleString()}`, "주가"]}
                  />
                  <Line
                    type='monotone'
                    dataKey='price'
                    stroke='#ef4444'
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#ef4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
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
