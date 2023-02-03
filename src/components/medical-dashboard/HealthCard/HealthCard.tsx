import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChartCustomLegend } from '../../common/charts/PieChartCustomLegend';
import { healthChartData } from 'constants/healthChartData';
import { Card } from '@app/components/common/Card/Card';

interface PiechartProps {
  records: any
}

export const HealthCard: React.FC<PiechartProps> = (props) => {
  const { t } = useTranslation();
  if (props.records == undefined || props.records.length == 0) {
    return <></>
  }

  let totalStock = 0
  let chartData = props.records.map((item:any) => {
    totalStock += item.currentStock
    return  {
      ...item,
      value: item.currentStock,
      name: item.productName,
      description: 'description',
    }
  });

  chartData = chartData.map((item:any)=>{
    const dist:any = item.currentStock/totalStock*100
    return {...item, value: parseInt(dist)}
  })
  const legendData = chartData.map((item:any) => ({ ...item, value: `${item.value}%` }));

  return (
    <Card title={'Distribution'} padding={'0 1.25rem 1.875rem'}>
      <PieChartCustomLegend
        name={'Distribution'}
        chartData={chartData}
        legendData={legendData}
        height="300px"
      />
    </Card>
  );
};
