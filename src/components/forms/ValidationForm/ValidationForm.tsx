import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { InputNumber } from '@app/components/common/inputs/InputNumber/InputNumber';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Switch } from '@app/components/common/Switch/Switch';
import { Radio, RadioButton, RadioGroup } from '@app/components/common/Radio/Radio';
import { Slider } from '@app/components/common/Slider/Slider';
import { Upload, UploadDragger } from '@app/components/common/Upload/Upload';
import { Rate } from '@app/components/common/Rate/Rate';
import { Checkbox, CheckboxGroup } from '@app/components/common/Checkbox/Checkbox';
import { notificationController } from '@app/controllers/notificationController';
import { Input, TextArea } from '@app/components/common/inputs/Input/Input';

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const normFile = (e = { fileList: [] }) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const ValidationForm: React.FC = () => {
  const [isFieldsChanged, setFieldsChanged] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  const requestNewStockMovement = async (paylaod: any) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paylaod),
    };

    const url  = "http://localhost:8080/api/v1/stock"
    fetch(url, requestOptions)
      .then((response) => {
        setLoading(false);
        setFieldsChanged(false);
        return response.json();
      })
      .then((data) => {
        notificationController.success({ message: t('common.success') })
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
    }, 3000);
  };

  return (
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
          <Option value="1">Yellow corn</Option>
          <Option value="2">White corn</Option>
        </Select>
      </BaseButtonsForm.Item>

      <BaseButtonsForm.Item
        name="type"
        label="Stock movement"
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
  );
};
