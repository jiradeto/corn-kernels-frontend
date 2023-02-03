import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { GradientStackedAreaChart } from '@app/components/charts/GradientStackedAreaChart/GradientStackedAreaChart';
import { VisitorsPieChart } from '@app/components/charts/VisitorsPieChart';
import { BarAnimationDelayChart } from '@app/components/charts/BarAnimationDelayChart/BarAnimationDelayChart';
import { ScatterChart } from '@app/components/charts/ScatterChart/ScatterChart';
import { LineRaceChart } from '@app/components/charts/LineRaceChart/LineRaceChart';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';


const MOCK_DATA = [
  ["Income", "Life Expectancy", "Population", "Country", "Date"],
  [14253, 70.004, 16177451, "Germany", "2023-01-11"],
  [736, 48.536704, 607167524, "Norway", "2023-01-11"],
  [9424, 63.39308, 6652086, "Cuba", "2023-01-11"],
  [8971, 67.8748, 4279108, "Finland", "2023-01-11"],

  [15358, 70.004, 16177451, "Germany", "2023-01-12"],
  [17428, 48.536704, 607167524, "Norway", "2023-01-12"],
  [9424, 63.39308, 6652086, "Cuba", "2023-01-12"],
  [11751, 67.8748, 4279108, "Finland", "2023-01-12"],

  [10442, 70.004, 16177451, "Germany", "2023-01-13"],
  [12385, 48.536704, 607167524, "Norway", "2023-01-13"],
  [10295, 63.39308, 6652086, "Cuba", "2023-01-13"],
  [10501, 67.8748, 4279108, "Finland", "2023-01-13"],

  [9496, 70.004, 16177451, "Germany", "2023-01-14"],
  [4943, 48.536704, 607167524, "Norway", "2023-01-14"],
  [12702, 63.39308, 6652086, "Cuba", "2023-01-14"],
  [17430, 67.8748, 4279108, "Finland", "2023-01-14"],
]

const ChartsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.charts')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col id="line-race" xs={24}>
          {/* <LineRaceChart records={MOCK_DATA}/> */}
        </Col>
        <Col id="bar-animation-delay" xs={24}>
          <BarAnimationDelayChart />
        </Col>
        <Col id="pie" xs={24} lg={12}>
          <VisitorsPieChart />
        </Col>
        <Col id="scatter" xs={24} lg={12}>
          <ScatterChart />
        </Col>
      </Row>
    </>
  );
};

export default ChartsPage;
