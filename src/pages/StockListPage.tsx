import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { notificationController } from 'controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { Col, Row, Space } from 'antd';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Table } from 'components/common/Table/Table';
import { BasicTableRow, Pagination } from 'api/table.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Breadcrumb, BreadcrumbItem } from '@app/components/common/Breadcrumb/Breadcrumb';
import * as S from '../components/tables/Tables/Tables.styles';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 50,
};

const ProductListPage: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const [productItems, setProductItems] = useState([]);
  const [productNamesMap, setProductNamesMap] = useState({});
  const [stockItems, setStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filterProductID, setFilterProductID] = useState(null);
  const [filterMovementType, setFilterMovementType] = useState(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchProductList = async () => {
    const url = process.env.REACT_APP_BACKEND_HOST + '/api/v1/product/list';
    setIsLoading(true);
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          setIsLoading(false);
          return response.json();
        })
        .then((jsonData) => {
          let nameMap: any = {};
          if (jsonData.data) {
            setProductItems(jsonData.data);
            jsonData.data.forEach((item: any) => {
              nameMap[item['ID']] = item['Name'];
            });
          }
          setProductNamesMap(nameMap);
        });
    }, 1000);
  };
  const fetchStockList = async () => {
    let url = process.env.REACT_APP_BACKEND_HOST + '/api/v1/stock/list?';
    if (filterProductID) {
      url += `productID=${filterProductID}&`;
    }
    if (filterMovementType) {
      url += `type=${filterMovementType}&`;
    }
    setIsLoading(true);
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          setIsLoading(false);
          return response.json();
        })
        .then((jsonData) => {
          setStockItems(jsonData.data);
        });
    }, 1000);
  };

  useEffect(() => {
    fetchStockList();
    fetchProductList();
  }, [fetch]);
  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'Type',
      key: 'MovementType',
      dataIndex: 'MovementType',
      render: (MovementType: string) => (
        <Row gutter={[10, 10]}>
          <Col>
            {MovementType == 'in' ? (
              <Status color={'var(--success-color)'} text={'IN'} />
            ) : (
              <Status color={'var(--error-color)'} text={'OUT'} />
            )}
          </Col>
        </Row>
      ),
      filterMode: 'tree',
      sorter: (a: any, b: any) => a.MovementType.localeCompare(b.MovementType),
    },
    {
      title: 'Quantity (kg)',
      dataIndex: 'Quantity',
      sorter: (a: any, b: any) => b - a,
      showSorterTooltip: true,
    },
    {
      title: 'Product',
      dataIndex: 'ProductID',
      sorter: (a: any, b: any) => a - b,
      render: (a: string) => {
        return <>{productNamesMap[a]}</>
      },
      showSorterTooltip: true,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      sorter: (a: any, b: any) => a.Description.localeCompare(b.Description),
      showSorterTooltip: true,
    },
    {
      title: 'Date',
      dataIndex: 'CreatedAt',
      render: (text: string) => {
        const parsedDate = new Date(text);
        return <span>{parsedDate.toLocaleDateString() + ' ' + parsedDate.toLocaleTimeString()}</span>;
      },
      filterMode: 'tree',
      sorter: (a: any, b: any) => a.CreatedAt.localeCompare(b.CreatedAt),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { name: string; key: number }) => {
        return (
          <Space>
            <Button
              type="ghost"
              onClick={() => {
                notificationController.info({ message: t('tables.inviteMessage', { name: record.name }) });
              }}
            >
              {'Edit'}
            </Button>
            <Button type="default" danger>
              {'Delete'}
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <PageTitle>{t('common.dataTables')}</PageTitle>
      <Col>
        <Breadcrumb>
          <BreadcrumbItem href="/">{t('breadcrumbs.home')}</BreadcrumbItem>
          <BreadcrumbItem href="/stocks">Stocks</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <>
        <S.TablesWrapper>
          <S.Card id="basic-table" title={'Stocks'} padding="1.25rem 1.25rem">
            <BaseButtonsForm isFieldsChanged={false}>
              <BaseButtonsForm.Item name="product" label="Product" hasFeedback rules={[{ message: '-' }]}>
                <Select
                  onSelect={(val: any) => {
                    setFilterProductID(val);
                  }}
                  placeholder={'-'}
                >
                  {(productItems|| []).map((item) => {
                    return <Option value={item['ID']}>{item['Name']}</Option>;
                  })}
                </Select>
              </BaseButtonsForm.Item>
              <BaseButtonsForm.Item name="type" label="Movement type" hasFeedback rules={[{ message: '-' }]}>
                <Select
                  placeholder={'-'}
                  onSelect={(val: any) => {
                    setFilterMovementType(val);
                  }}
                >
                  <Option value="in">IN</Option>
                  <Option value="out">OUT</Option>
                </Select>
              </BaseButtonsForm.Item>
            </BaseButtonsForm>
            <Space>
              <Button type="ghost" onClick={fetchStockList}>
                Search
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  navigate('/stocks/new');
                }}
              >
                Add
              </Button>
              <Button type="link" onClick={fetchProductList}>
                <CSVLink data={stockItems || []}>Download CSV</CSVLink>
              </Button>
            </Space>
          </S.Card>
          <S.Card id="basic-table" padding="1.25rem 1.25rem 0">
            <Table loading={isLoading} columns={columns} dataSource={stockItems} scroll={{ x: 800 }} bordered />
          </S.Card>
        </S.TablesWrapper>
      </>
    </>
  );
};

export default ProductListPage;
