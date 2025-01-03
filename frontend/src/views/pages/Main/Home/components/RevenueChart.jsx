import { Column, Line } from '@ant-design/plots';
import { Card, DatePicker, Space, Typography, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import CardBlock from '~/components/CardBlock';
import { DefaultNumberStatisChart } from '../data';
import { ChartService, ErrorService } from '~/services';
import dayjs from 'dayjs';
import AppContext from '~/context';
import { MonitorApi } from '~/api';
import { CustomedDateRangePicker } from '~/components';
import { FormatNumber } from '~/services/RegularService';

const zones = ['A', 'B', 'C'];
function RevenueChart({}) {
  const { state, actions } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [dates, setDates] = useState([dayjs().add(-7, 'd').startOf('d'), dayjs().endOf('d')]);
  const defaultConfig = ChartService.defaultConfig;
  const { token } = theme.useToken();
  const color = [token['purple'], token['magenta'], token['orange2']];
  const unit = {
    x: 'Ngày',
    y: 'VNĐ'
  };

  const config = {
    ...defaultConfig,
    height: 200,
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'zone',
    yAxis: {
      title: {
        text: unit.y,
        style: ChartService.textStyle
      }
    },
    legend: {
      position: 'top',
      itemName: {
        formatter: (text) => {
          return 'Khu ' + text;
        }
      }
    },
    tooltip: {
      title: (e) => {
        return e;
      },
      customItems: (originalItems) => {
        let rs = originalItems.map((org) => {
          return {
            ...org,
            name: 'Khu ' + org.name,
            value: FormatNumber(org.value, { isEndZeroDecimal: false }) + ' ' + unit.y
          };
        });
        return rs;
      }
    }
  };

  const onChangeDate = (dates, dateStrings) => {
    setDates(dates);
  };

  const callApi = async () => {
    try {
      let [startDate, endDate] = dates;
      const dateArr = ChartService.generateRange(startDate, endDate, 'd', 'L');
      //object d
      startDate = startDate.format('L'); //DD/MM/YYYY 20/11/2023
      endDate = endDate.format('L');
      const api = await MonitorApi.getRevenue({ startDate, endDate });
      const result = api.sort((a, b) => dayjs(a.date, 'L') - dayjs(b.date, 'L'));
      //hanlde Data

      const newData = [];
      const defaultValue = 0;
      dateArr.map((date) => {
        let value = null;
        const [el] = result.slice(0, 1);

        if (el && el.date === date) {
          result.shift();
          zones.map((zone) => {
            value = el.data[zone] || defaultValue;

            newData.push({
              date,
              value,
              zone,
              isData: true
            });
          });
        } else {
          zones.map((zone) => {
            value = defaultValue;
            newData.push({
              date,
              value,
              zone,
              isData: false
            });
          });
        }
      });

      setData(newData);
    } catch (error) {
      // ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  useEffect(() => {
    callApi();
  }, [dates, state.parkingEvent]);

  return (
    <Card
      title={<Typography.Title level={4}>Biểu đồ thống kê doanh thu theo ngày</Typography.Title>}
      extra={
        <Space>
          <Typography.Text>Thời gian:</Typography.Text>
          <CustomedDateRangePicker
            onChange={onChangeDate}
            format={'DD/MM/YYYY'}
            value={dates}
            bordered={false}
            allowClear={false}
            suffixIcon={false}
            style={{ width: 220 }}
          />
        </Space>
      }
      className="card-main">
      <CardBlock>
        <div className="px-4">
          <Line {...config} />
        </div>
      </CardBlock>
    </Card>
  );
}

export default RevenueChart;
