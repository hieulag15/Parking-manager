import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  TimePicker,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Filter({ filter, onChange, filterList = [], RangePicker, filterNames = {} }) {
  const { rangeDate = ['startDay', 'endDay'] } = filterNames;
  const START_DAY = rangeDate[0];
  const END_DAY = rangeDate[1];
  const getValue = (name, values, format) => {
    let rs = values[name];
    switch (name) {
      case 'rangeDate':
        if (values[START_DAY] && values[END_DAY])
          rs = [dayjs(values[START_DAY], format), dayjs(values[END_DAY], format)];
        break;
      case 'timePickerRange':
        if (values.startTime && values.endTime)
          rs = [dayjs(values?.startTime, format), dayjs(values?.endTime, format)];
        break;
    }

    return rs;
  };

  const onSubmit = (values = {}) => {
    let rs = {};
    for (let [key, value] of Object.entries(values)) {
      if (value === false || value) rs[key] = value;
    }
    return rs;
  };

  const { t: lag, i18n } = useTranslation();
  const onChangeItem = (name, value) => {
    let newValue = { [name]: value };
    switch (name) {
      case 'rangeDate':
        newValue = {
          [START_DAY]: value[0],
          [END_DAY]: value[1]
        };
        break;
      case 'timePickerRange':
        newValue = {
          startTime: value[0],
          endTime: value[1]
        };
        break;
    }
    onChange(onSubmit({ ...filter, ...newValue }));
  };
  return (
    <div>
      {filterList.map((item, index) => {
        const { label, name, inputProps } = item;
        const config = {
          value: getValue(name, filter, inputProps?.format)
        };
        return (
          <Space key={name} style={{ marginLeft: index && 16 }} direction="vertical">
            <Typography.Text>{label}</Typography.Text>
            <InputRender onChange={(value) => onChangeItem(name, value)} item={item} {...config} />
          </Space>
        );
      })}
    </div>
  );
}

const InputRender = ({ item = {}, value, width = 200, onChange }) => {
  let dom = null;
  let { inputProps, type } = item;

  const onChangeEvent = (e) => {
    onChange(e.target.value);
  };
  const onChangeChecked = (e) => {
    onChange(e.target.checked);
  };
  const onChangeValue = (value) => {
    onChange(value);
  };

  const onClear = (rt) => {
    onChange(null);
  };

  inputProps = {
    ...inputProps,
    defaultValue: value
  };
  if (inputProps.allowClear) inputProps.onClear = onClear;
  switch (type) {
    case 'select':
      dom = <Select onSelect={onChangeValue} {...inputProps} style={{ width: 100 }} />;
      break;

    case 'input':
      dom = <Input onPressEnter={onChangeEvent} {...inputProps} style={{ width: 200 }} />;
      break;

    case 'datePicker':
      dom = <DatePicker onChange={onChangeValue} {...inputProps} />;
      break;

    case 'timePicker':
      dom = (
        <TimePicker
          onChange={(value) => onChangeValue(value.format(inputProps.format))}
          {...inputProps}
        />
      );
      break;
    case 'timePickerRange':
      dom = (
        <TimePicker.RangePicker
          onChange={(ranges = []) =>
            ranges?.length > 0
              ? onChangeValue([ranges[0].format(inputProps.format), ranges[1].format(inputProps.format)])
              : onChangeValue([null, null])
          }
          {...inputProps}
        />
      );
      break;
    case 'range':
      dom = (
        <DatePicker.RangePicker
          onChange={(ranges = []) =>
            ranges?.length > 0
              ? onChangeValue([
                  ranges[0].format(inputProps.format),
                  ranges[1].format(inputProps.format)
                ])
              : onChangeValue([null, null])
          }
          {...inputProps}
        />
      );
      break;
    case 'check':
      dom = <Checkbox onChange={onChangeChecked} {...inputProps} />;
      break;
  }

  return dom;
};

export default Filter;
