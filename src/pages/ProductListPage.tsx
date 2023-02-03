import React, { useEffect, useState, useCallback } from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { defineColorByPriority } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { ColumnsType } from 'antd/es/table';
import { Col, Row, Space, TablePaginationConfig } from 'antd';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Table } from 'components/common/Table/Table';
import { TextArea, Input } from '@app/components/common/inputs/Input/Input';
import { BasicTableRow, getBasicTableData, Pagination, Tag } from 'api/table.api';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '../components/tables/Tables/Tables.styles';
import { CSVLink } from "react-csv";

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
  const [isLoading, setIsLoading] = useState(false);
  const [filterProductName, setFilterProductName] = useState(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchProductList = async () => {
    let url = process.env.REACT_APP_BACKEND_HOST + '/api/v1/product/list';
    if (filterProductName) {
      url += `?q=${filterProductName}`;
    }
    setIsLoading(true);
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          setIsLoading(false);
          return response.json();
        })
        .then((jsonData) => {
          setProductItems(jsonData.data);
        });
    }, 1000);
  };

  useEffect(() => {
    fetchProductList();
  }, [fetch]);
  const columns: ColumnsType<BasicTableRow> = [
    {
      title: 'ProductID',
      dataIndex: 'ID',
      render: (text: string) => <span>{text}</span>,
      filterMode: 'tree',
      sorter: (a: any, b: any) => a.ID.localeCompare(b.ID),
    },
    {
      title: t('common.name'),
      dataIndex: 'Name',
      render: (text: string) => <span>{text}</span>,
      filterMode: 'tree',
      sorter: (a: any, b: any) => a.Name.localeCompare(b.Name),
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      sorter: (a: any, b: any) => a.Description.localeCompare(b.Description),
      showSorterTooltip: true,
    },
    {
      title: 'In Stock (kg)',
      dataIndex: 'Quantity',
      sorter: (a: any, b: any) => a - b,
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
      <>
        <S.TablesWrapper>
          <S.Card id="basic-table" title={'Products'} padding="1.25rem 1.25rem">
            <BaseButtonsForm isFieldsChanged={false}>
              <BaseButtonsForm.Item name="name" label={'name'} hasFeedback rules={[{ message: 'Please provide name' }]}>
                <label>
                  <BaseButtonsForm.Item name="name" noStyle>
                    <Input
                      type="text"
                      onPressEnter={fetchProductList}
                      onChange={(val: any) => {
                        setFilterProductName(val.target.value);
                      }}
                    />
                  </BaseButtonsForm.Item>
                </label>
              </BaseButtonsForm.Item>
            </BaseButtonsForm>
            <Space>
              <Button type="ghost" onClick={fetchProductList}>
                Search
              </Button>
              
              <Button
                type="primary"
                onClick={() => {
                  navigate('/products/new');
                }}
              >
                Add
              </Button>
              <Button type="link" onClick={fetchProductList}>
                <CSVLink data={productItems || []}>Download CSV</CSVLink>
              </Button>
            </Space>
          </S.Card>
          <S.Card id="basic-table" padding="1.25rem 1.25rem 0">
            <Table loading={isLoading} columns={columns} dataSource={productItems} scroll={{ x: 800 }} bordered />
          </S.Card>
        </S.TablesWrapper>
      </>
    </>
  );
};

export default ProductListPage;
