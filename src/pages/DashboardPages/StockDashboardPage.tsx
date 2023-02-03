import React, { useEffect, useState, useCallback } from 'react';
import { Col, Row } from 'antd';
import { Loading } from '@app/components/common/Loading';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { MapCard } from '@app/components/medical-dashboard/mapCard/MapCard';
import { ScreeningsCard } from '@app/components/medical-dashboard/screeningsCard/ScreeningsCard/ScreeningsCard';
import { ActivityCard } from '@app/components/medical-dashboard/activityCard/ActivityCard';
import { TreatmentCard } from '@app/components/medical-dashboard/treatmentCard/TreatmentCard';
import { CovidCard } from '@app/components/medical-dashboard/covidCard/CovidCard';
import { HealthCard } from '@app/components/medical-dashboard/HealthCard/HealthCard';
import { FavoritesDoctorsCard } from '@app/components/medical-dashboard/favoriteDoctors/FavoriteDoctorsCard/FavoritesDoctorsCard';
import { PatientResultsCard } from '@app/components/medical-dashboard/PatientResultsCard/PatientResultsCard';
import { StatisticsCards } from '@app/components/medical-dashboard/statisticsCards/StatisticsCards';
import { BloodScreeningCard } from '@app/components/medical-dashboard/bloodScreeningCard/BloodScreeningCard/BloodScreeningCard';
import { NewsCard } from '@app/components/medical-dashboard/NewsCard/NewsCard';
import { References } from '@app/components/common/References/References';
import { LineRaceChart } from '@app/components/charts/LineRaceChart/LineRaceChart';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './DashboardPage.styles';

const StockDashboardPage: React.FC = () => {
  const { isTablet, isDesktop } = useResponsive();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [stockInDaily, setStockInDaily] = useState(null);
  const [stockOutDaily, setStockOutDaily] = useState(null);

  const preprocessLineRaceChart = (data: any) => {
    const lineRaceRecords = [['movementDate', 'movementType', 'productID', 'productName', 'totalQuantity']];
    data.forEach((item: any) => {
      lineRaceRecords.push([
        item['movementDate'],
        item['movementType'],
        item['productID'],
        item['productName'],
        item['totalQuantity'],
      ]);
    });
    return lineRaceRecords;
  };

  const fetchDashboardData = async () => {
    const url = process.env.REACT_APP_BACKEND_HOST + '/api/v1/dashboard';
    setIsLoading(true);
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          setIsLoading(false);
          return response.json();
        })
        .then((jsonData) => {
          if (jsonData.data) {
            setDashboardData(jsonData.data);
            if (jsonData.data.dailyMovement.in) setStockInDaily(jsonData.data.dailyMovement.in);
            if (jsonData.data.dailyMovement.out) setStockOutDaily(jsonData.data.dailyMovement.out);
            if (jsonData.data.availableStocks) setAvailableStocks(jsonData.data.availableStocks);
          }
        });
    }, 1000);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetch]);

  const renderDesktopLayoutChart = (availableStock: any) => {
    if (!dashboardData) return <></>;
    return (
      <>
        <Col id="activity" xl={24} xxl={12}>
          {stockInDaily ? (
            <LineRaceChart
              movementType='in'
              filterProductID={availableStock.productID}
              records={preprocessLineRaceChart(stockInDaily)}
              title={`⬆️ Stock in: ${availableStock.productName}`}
            />
          ) : (
            <></>
          )}
        </Col>
        <Col id="activity" xl={24} xxl={12}>
          {stockOutDaily ? (
            <LineRaceChart
              movementType='out'
              filterProductID={availableStock.productID}
              records={preprocessLineRaceChart(stockOutDaily)}
              title={`⬇️ Stock out: ${availableStock.productName}`}
            />
          ) : (
            <></>
          )}
        </Col>
      </>
    );
  };

  const desktopLayout = (
    <Row>
      <S.LeftSideCol xl={14} xxl={17}>
        <Row gutter={[30, 30]}>
          <Col span={24}></Col>
          {availableStocks.map((availableStock: any) => renderDesktopLayoutChart(availableStock))}
        </Row>
        <References />
      </S.LeftSideCol>

      <S.RightSideCol xl={10} xxl={7}>
        <div id="blood-screening">
          <BloodScreeningCard records={availableStocks}/>
        </div>
        <S.Space />
        <HealthCard records={availableStocks} />
      </S.RightSideCol>
    </Row>
  );

  const mobileAndTabletLayout = (
    <Row gutter={[20, 20]}>
      <Col id="treatment-plan" xs={24} md={24} order={(isTablet && 10) || 0}>
        {/* <LineRaceChart records={MOCK_DATA} title="Stock in"/> */}
      </Col>

      <Col id="health" xs={24} md={12} order={(isTablet && 9) || 0}>
        <HealthCard records={availableStocks} />
      </Col>

      <Col id="blood-screening" xs={24} md={12} order={(isTablet && 6) || 0}>
        <BloodScreeningCard records={availableStocks}/>
      </Col>
    </Row>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Row style={{ margin: 80 }} gutter={[20, 20]}>
          <Loading />
        </Row>
      );
    }

    if (dashboardData == null) {
      return <></>;
    }
    if (isDesktop) {
      return desktopLayout;
    } else {
      return mobileAndTabletLayout;
    }
  };

  return renderContent();
};

export default StockDashboardPage;
