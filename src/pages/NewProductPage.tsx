import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Button } from '@app/components/common/buttons/Button/Button';
import { TextArea, Input  } from '@app/components/common/inputs/Input/Input';
import { useNavigate } from 'react-router-dom';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { notificationController } from '@app/controllers/notificationController';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const NewProductPage: React.FC = () => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const requestNewProduct = async (paylaod: any) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paylaod),
    };

    const url = process.env.REACT_APP_BACKEND_HOST + '/api/v1/product';
    fetch(url, requestOptions)
      .then((response) => {
        setLoading(false);
        setFieldsChanged(false);
        return response.json();
      })
      .then((data) => {
        notificationController.success({ message: t('common.success') });
        navigate('/products');
      });
  };
  const onFinish = async (values = { name: '', description: '' }) => {
    const payload = {
      name: values.name,
      description: values.description,
    };
    setLoading(true);
    setTimeout(async () => {
      await requestNewProduct(payload);
    }, 1000);
  };
  return (
    <>
      <PageTitle>{t('common.advancedForms')}</PageTitle>
      <Card id="validation form" title={'New Product'} padding="1.25rem">
        <BaseButtonsForm
          {...formItemLayout}
          isFieldsChanged={true}
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
            name="name"
            label={'name'}
            hasFeedback
            rules={[{ required: true, message: 'Please provide name' }]}
          >
            <label>
              <BaseButtonsForm.Item name="name" noStyle>
                <Input type='text' />
              </BaseButtonsForm.Item>
            </label>
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

         
        </BaseButtonsForm>
      </Card>
    </>
  );
};

export default NewProductPage;
