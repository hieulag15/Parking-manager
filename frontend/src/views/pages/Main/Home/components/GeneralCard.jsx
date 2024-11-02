import { Gauge } from '@ant-design/plots';
import { Card, Space, Tag, Typography, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { MonitorApi } from '~/api';
import CardBlock from '~/components/CardBlock';
import CustomedTag from '~/components/CustomedTag';
import AppContext from '~/context';
import { useStatusByZone } from '~/hook/hookMonitor';

function GeneralCard({ zone = 'A' }) {
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);

  const { data: statusData, refetch } = useStatusByZone(zone);

  const data = statusData || {
    total: 1,
    occupied: 0,
    unoccupied: 0
  };

  const config = {
    height: 170,
    percent: data.occupied / data.total,
    range: {
      color: 'l(0) 0:#B8E1FF 1:#3D76DD'
    },
    startAngle: Math.PI,
    endAngle: 2 * Math.PI,
    innerRadius: 0.84,
    min: 0,
    indicator: {
      pointer: null,
      pin: null
    },
    xAxis: {
      grid: {
        line: {
          style: {
            stroke: 'black',
            lineWidth: 24,
            lineDash: [4, 5],
            strokeOpacity: 0.7,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            cursor: 'pointer'
          }
        }
      }
    },
    axis: {
      label: {
        offset: 5,
        offsetY: 25,
        style: { fill: '#000', fontSize: 14, color: '#000' },
        formatter: (val) => {
          if (val === '0') {
            return '0';
          } else if (val === '1') {
            return val * data.total;
          }
        }
      },
      subTickLine: null,
      tickLine: null
    },
    statistic: {
      title: {
        offsetY: -44,
        style: {
          fontSize: 26,
          color: '#000'
        },
        formatter: (e) => {
          return data.occupied.toString();
        }
      },
      content: {
        offsetY: -24,
        style: {
          fontSize: '18px',
          lineHeight: '44px',
          color: '#4B535E'
        },
        formatter: () => 'Xe đang đỗ'
      }
    },
    gaugeStyle: {
      lineCap: 'round',
      lineDash: [4, 5],
      strokeOpacity: 0.7,
      shadowColor: token.boxShadowCard,
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    }
  };

  useEffect(() => {
    refetch();
  }, [state.parkingEvent]);

  return (
    <Card
      title={
        <CustomedTag bordered={false} entity={zone} entityType={'zone'}>
          {`Khu ${zone}`}
        </CustomedTag>
      }
      className="card-main">
      <CardBlock>
        <div className="py-1">
          <Gauge {...config} />
        </div>
      </CardBlock>
    </Card>
  );
}

export default GeneralCard;
