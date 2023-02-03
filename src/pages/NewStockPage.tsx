import { useTranslation } from 'react-i18next';
import { Col, Space } from 'antd';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Button } from '@app/components/common/buttons/Button/Button';
import { TextArea } from '@app/components/common/inputs/Input/Input';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { Breadcrumb, BreadcrumbItem } from '@app/components/common/Breadcrumb/Breadcrumb';
import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';

import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const NewStockPage: React.FC = () => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [productItems, setProductItems] = useState([]);

  const fetchProductList = async () => {
    const url = process.env.REACT_APP_BACKEND_HOST + '/api/v1/product/list';
    setLoading(true);
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          setLoading(false);
          return response.json();
        })
        .then((jsonData) => {
          setProductItems(jsonData.data);
        });
    }, 1000);
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const requestNewStockMovement = async (paylaod: any) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paylaod),
    };

    const url = process.env.REACT_APP_BACKEND_HOST + '/api/v1/stock';
    fetch(url, requestOptions)
      .then((response) => {
        setLoading(false);
        setFieldsChanged(false);
        return response.json();
      })
      .then((data) => {
        notificationController.success({ message: t('common.success') });
        navigate('/stocks');
      });
  };
  const onFinish = async (values = { product: '', description: '', type: '', quantity: 0 }) => {
    const payload = {
      ProductID: values.product,
      Description: values.description,
      MovementType: values.type,
      Quantity: values.quantity,
    };

    setLoading(true);
    setTimeout(async () => {
      await requestNewStockMovement(payload);
    }, 1000);
  };
  return (
    <>
      <PageTitle>{t('common.advancedForms')}</PageTitle>
      <Col>
        <Breadcrumb>
          <BreadcrumbItem href="/">{t('breadcrumbs.home')}</BreadcrumbItem>
          <BreadcrumbItem href="/stocks">Stocks</BreadcrumbItem>
          <BreadcrumbItem href="/stocks/new">Add</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <br></br>
      <Card id="validation form" title={'New stock movement'} padding="1.25rem">
        <BaseButtonsForm
          {...formItemLayout}
          isFieldsChanged={isFieldsChanged}
          onFieldsChange={() => setFieldsChanged(true)}
          name="validateForm"
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
          }}
          footer={
            <BaseButtonsForm.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {t('common.submit')}
              </Button>
            </BaseButtonsForm.Item>
          }
          onFinish={onFinish}
        >
          <BaseButtonsForm.Item
            name="product"
            label="Product"
            hasFeedback
            rules={[{ required: true, message: 'Please select product' }]}
          >
            <Select placeholder={'Please select product'}>
              {productItems.map((item) => {
                return <Option value={item['ID']}>{item['Name']}</Option>;
              })}
            </Select>
          </BaseButtonsForm.Item>

          <BaseButtonsForm.Item
            name="type"
            label="Movement type"
            hasFeedback
            rules={[{ required: true, message: 'Please select movement type' }]}
          >
            <Select placeholder={'Please select movement type'}>
              <Option value="in">IN</Option>
              <Option value="out">OUT</Option>
            </Select>
          </BaseButtonsForm.Item>

          <BaseButtonsForm.Item
            name="description"
            label={'description'}
            hasFeedback
            rules={[{ required: true, message: 'Please provide description' }]}
          >
            <label>
              <BaseButtonsForm.Item name="description" noStyle>
                <TextArea rows={4} />
              </BaseButtonsForm.Item>
            </label>
          </BaseButtonsForm.Item>

          <BaseButtonsForm.Item
            name="quantity"
            label={'quantity'}
            hasFeedback
            rules={[{ required: true, message: 'Please specify quantity' }]}
          >
            <label>
              <BaseButtonsForm.Item name="quantity" noStyle>
                <InputNumber defaultValue={0} min={1} />
              </BaseButtonsForm.Item>
            </label>
            <span> Kilogram(s)</span>
          </BaseButtonsForm.Item>
        </BaseButtonsForm>
      </Card>
    </>
  );
};

export default NewStockPage;
