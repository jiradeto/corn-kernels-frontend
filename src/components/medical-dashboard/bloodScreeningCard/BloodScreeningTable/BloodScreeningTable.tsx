import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useResponsive } from 'hooks/useResponsive';
import * as S from './BloodScreeningTable.styles';
import { BloodTestResult, flags, results } from '@app/constants/bloodTestResults';
import { ColumnsType } from 'antd/es/table';

interface BloodScreeningTableProps {
  activeItem: BloodTestResult;
  setActiveItem: (item: BloodTestResult) => void;
  records: any;
}

export const BloodScreeningTable: React.FC<BloodScreeningTableProps> = ({ activeItem, setActiveItem, records }) => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();

  let minQty = 1000000;
  let customData = records.map((item: any) => {
    minQty = Math.min(minQty, item.currentStock);
    return {
      ...item,
      test: item.productName,
      result: item.currentStock,
    };
  });
  customData = customData.map((item: any) => ({
    ...item,
    flag: item.currentStock == minQty ? 1 : 0,
  }));
  const [dataSource] = useState<BloodTestResult[]>(customData);
  const columns: ColumnsType<BloodTestResult> = [
    {
      title: 'Product',
      dataIndex: 'test',
      width: '30%',
      render: (test: string, { key }) => <S.Text $isActive={activeItem.key === key}>{test}</S.Text>,
    },
    {
      title: 'Stock',
      dataIndex: 'result',
      render: (result: number, { key }) => <S.Text $isActive={activeItem.key === key}>{result}</S.Text>,
    },
    {
      title: t('medical-dashboard.bloodScreening.units'),
      dataIndex: 'units',
      render: (units, { key }) => <S.Text $isActive={activeItem.key === key}>kg</S.Text>,
    },
    {
      title: t('medical-dashboard.bloodScreening.flag'),
      dataIndex: 'flag',
      render: (flag, { key }) => (
        <S.Flag $isNorm={flag == 0} $isActive={activeItem.key === key}>
          {t(flags[flag])}
        </S.Flag>
      ),
    },
  ];

  return (
    <S.Table
      size={'small'}
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{ y: isDesktop ? 300 : isTablet ? 620 : 400 }}
      onRow={(record) => {
        return {
          onClick: () => setActiveItem(record),
        };
      }}
    />
  );
};
