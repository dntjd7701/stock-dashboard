
"use client";

import React from 'react';
import { Activity, Users, Building, Globe } from 'lucide-react';
import Header from '@/components/Header';
import StatCard from '@/components/ui/StatCard';
import PeriodButton from '@/components/ui/PeriodButton';
import RechartsPriceChart from '@/components/charts/recharts/RechartsPriceChart';
import RechartsShareholderChart from '@/components/charts/recharts/RechartsShareholderChart';
import { useStockData } from '@/components/hooks/useStockData';

/**
 * Recharts를 사용하여 주식 대시보드를 표시하는 메인 컴포넌트
 * - useStockData 훅을 통해 데이터를 관리
 * - 주요 지표, 기간 선택 버튼, 차트 그리드를 포함
 */
const StockDashboard = () => {
  const { 
    isClient,
    stockData, 
    individualData, 
    foreignData, 
    institutionalData, 
    selectedPeriod, 
    setSelectedPeriod, 
    priceChangePercent, 
    currentPrice 
  } = useStockData('1Y');

  // 클라이언트 사이드에서만 렌더링되도록 처리
  if (!isClient) {
    return <div className='min-h-screen bg-black text-white flex items-center justify-center'>로딩 중...</div>;
  }

  return (
    <div className='min-h-screen bg-black text-white'>
      <Header chartType='rechart' />

      <main className='max-w-7xl mx-auto p-6'>
        {/* 주요 지표 섹션 */}
        <section className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
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
        </section>

        {/* 기간 선택 버튼 섹션 */}
        <section className='flex space-x-2 mb-6'>
          {["6M", "1Y", "2Y", "5Y"].map((period) => (
            <PeriodButton
              key={period}
              period={period}
              active={selectedPeriod === period}
              onClick={setSelectedPeriod}
            />
          ))}
        </section>

        {/* 차트 그리드 섹션 */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800 lg:col-span-2'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Activity className='text-red-600 mr-2' />
              주가 차트
            </h3>
            <RechartsPriceChart data={stockData} />
          </div>

          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Users className='text-blue-500 mr-2' />
              개인 보유 현황
            </h3>
            <RechartsShareholderChart data={individualData} color="#3b82f6" title="개인" />
          </div>

          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Globe className='text-green-500 mr-2' />
              외국인 보유 현황
            </h3>
            <RechartsShareholderChart data={foreignData} color="#10b981" title="외국인" />
          </div>

          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800 lg:col-span-2'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Building className='text-purple-500 mr-2' />
              기관 보유 현황
            </h3>
            <RechartsShareholderChart data={institutionalData} color="#8b5cf6" title="기관" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default StockDashboard;
