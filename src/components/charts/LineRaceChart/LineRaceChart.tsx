import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@app/components/common/Card/Card';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';

const COLORS = [
  '#495387',
  '#F8CA31',
  '#E3430C',
  '#0BA8F1',
  '#A6D951',
  '#3B0500',
  '#CDAC35',
  '#079886',
  '#3C7FF5',
  '#1DAEDE',
  '#F8C45D',
  '#C4871E',
  '#28BB84',
  '#270348',
  '#6AD189',
  '#902287',
  '#F1AF42',
  '#895BB6',
  '#DFE93F',
  '#324D81',
  '#D48CFF',
  '#2C157B',
  '#228BBC',
  '#59C31C',
  '#CACD7A',
  '#01C9E5',
  '#A5B936',
  '#2B429A',
  '#AC4268',
  '#91739D',
  '#82397D',
  '#E71BFC',
  '#CDDEEC',
  '#A34080',
  '#A8D3B1',
  '#FA358A',
  '#E72983',
  '#F2E4CC',
  '#8D170D',
  '#19C22D',
  '#1443D7',
  '#A33FEB',
  '#FD8F30',
  '#975B04',
  '#8FAB09',
  '#3164BF',
  '#25F492',
  '#C5F886',
  '#9DA42F',
  '#D5BAE1',
  '#E598B8',
  '#D6EDB3',
  '#48D784',
  '#2FFD29',
  '#052807',
  '#BCEBAF',
  '#CEABF6',
  '#BEB312',
  '#C125D2',
  '#974707',
  '#471104',
  '#FBC5F0',
  '#55BAE7',
  '#D4096A',
  '#94A58C',
  '#225F5F',
  '#AE18DC',
  '#3957FB',
  '#A312C3',
  '#F8489B',
  '#668865',
  '#45A4A3',
  '#FDBBC6',
  '#9FC52C',
  '#FF6B98',
  '#D6F777',
  '#2367E9',
  '#97712E',
  '#F16504',
  '#90F7F4',
  '#7112FC',
  '#B74025',
  '#9B9F81',
  '#BEA8D9',
  '#2EA536',
  '#C527B9',
  '#459CF6',
  '#4C2A17',
  '#B4AE86',
  '#3F7E82',
  '#A3E4B5',
  '#126B1A',
  '#578588',
  '#0B2A0C',
  '#B3894F',
  '#8896B7',
  '#D20E41',
  '#4C98C5',
  '#A4A185',
  '#61A272',
  '#B05042',
  '#E074AA',
];
interface DataRow {
  id: string;
  fromDatasetId: string;
  transform: {
    type: string;
    config: { and: [{ dimension: string; '=': string }] };
  };
}

interface SeriesRow {
  type: string;
  datasetId: string;
  showSymbol: boolean;
  name: string;
  endLabel: {
    show: boolean;
    formatter: (params: { value: string }) => string;
    color?: string;
  };
  labelLayout: {
    moveOverlap: string;
  };
  emphasis: {
    focus: string;
  };
  encode: {
    x: string;
    y: string;
    label: [string, string];
    itemName: string;
    tooltip: [string];
  };
}

interface ChartProps {
  records: any;
  title: string;
  filterProductID: string;
  movementType: string;
}
export const LineRaceChart: React.FC<ChartProps> = (props) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [series, setSeries] = useState<SeriesRow[]>([]);

  const theme = useAppSelector((state) => state.theme.theme);

  const runAnimation = useCallback(() => {
    var productIDs: string[] = [props.filterProductID];
    const datasetWithFilters: DataRow[] = [];
    const seriesList: SeriesRow[] = [];

    productIDs.forEach((productID) => {
      const datasetId = `dataset_${productID}`;
      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [{ dimension: 'productID', '=': productID }],
          },
        },
      });
      seriesList.push({
        type: 'line',
        datasetId: datasetId,
        showSymbol: false,
        name: productID,
        endLabel: {
          show: true,
          formatter: (params) => `${params.value[3]}: ${params.value[4]}`,
          color: themeObject[theme].textMain,
        },
        labelLayout: {
          moveOverlap: 'shiftY',
        },
        emphasis: {
          focus: 'series',
        },
        encode: {
          x: 'movementDate',
          y: 'totalQuantity',
          label: ['productID', 'totalQuantity'],
          itemName: 'movementDate',
          tooltip: ['totalQuantity'],
        },
      });
    });
    setData(datasetWithFilters);
    setSeries(seriesList);
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      runAnimation();
    }, 200);
  }, [runAnimation]);

  const option = {
    color: COLORS[parseInt(props.filterProductID)],
    animationDuration: 3000,
    dataset: [
      {
        id: 'dataset_raw',
        source: props.records,
      },
      ...data,
    ],
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle',
    },
    yAxis: {
      name: '',
    },
    grid: {
      left: 65,
      right: 150,
      top: 20,
      bottom: 30,
    },
    series: series,
  };
  return (
    <Card padding="0 0 1.875rem" title={props.title} size={'small'}>
      <BaseChart option={option} height="8rem" />
    </Card>
  );
};
