import React, { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Flex, Radio, theme, Typography, Tag, Spin, Skeleton } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { DetailFloorStyled, TransformBlock } from './style';
import { MapInteractionCSS } from 'react-map-interaction';
import { useSearchParams } from 'react-router-dom';
import { SLOTS_A } from './parkingA';
import { SLOTS_B } from './parkingB';
import { SLOTS_C } from './parkingC';
import CarA from '~/assets/images/blue-car.png';
import CarB from '~/assets/images/blue-car.png';
import CarC from '~/assets/images/blue-car.png';
import MapA from '~/assets/images/MapA.svg?react';
import MapB from '~/assets/images/mapB.svg?react';
import MapC from '~/assets/images/mapC.svg?react';
import dayjs from 'dayjs';
import DetailSlot from './DetailSlot';
import AppContext from '~/context';
import { ParkingApi } from '~/api';
import { useGetStatus } from '~/hook/hookParking';
import socket from '~/socket';

function Map({}) {
  const { token } = theme.useToken();
  const { colorBgContainer } = token;
  const { state, actions } = useContext(AppContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [slots, setSlots] = useState([]);
  const zone = searchParams.get('zone') || 'A';
  const isMounted = useRef(false);
  const onChangeZone = (e) => {
    setSearchParams({ zone: e.target.value });
  };

  const { data: statusData, refetch, isFetching: loading } = useGetStatus({ zone});

  useEffect(() => {
    refetch();
  }, [state.parkingEvent]);

  useEffect(() => {
    if (statusData) {
      setSlots(statusData.slots);
    }
  }, [statusData]);

  //socket
  useEffect(() => {
    const handleParkingUpdated = () => {
      refetch();
    };

    // Config websocket
    socket.on('connect', () => {
      console.log('socket successful');
    });

    socket.on('parkingUpdated', handleParkingUpdated);

    return () => {
      socket.off('connect', () => {
        console.log('socket close');
      });
      socket.off('parkingUpdated', handleParkingUpdated);
    };
  }, [refetch]);

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Bản đồ'} />
      <Content className="w-100 py-3">
        <Flex>
          <Radio.Group defaultValue={zone} buttonStyle="solid" onChange={onChangeZone}>
            <Radio.Button value="A">Khu A</Radio.Button>
            <Radio.Button value="B">Khu B</Radio.Button>
            <Radio.Button value="C">Khu C</Radio.Button>
          </Radio.Group>
        </Flex>
        <TransformBlock
          className="mt-2 overflow-hidden"
          style={{ backgroundColor: token.neutral5 }}>
          <Spin spinning={loading} wrapperClassName="h-100 w-100">
            <MapInteractionCSS
              minScale={1}
              maxScale={1.2}
              translationBounds={{ xMin: -100, yMin: -100, xMax: 800, yMax: 600  }}>
              <div className="map-wrapper">
                {useMemo(() => {
                  let vehicles;
                  let newWidth = 50;
                  let currMap;
                  switch (zone) {
                    case 'A':
                      vehicles = SLOTS_A;
                      newWidth = 52;
                      currMap = CarA;
                      break;
                    case 'B':
                      vehicles = SLOTS_B;
                      newWidth = 76;
                      currMap = CarB;
                      break;
                    case 'C':
                      vehicles = SLOTS_C;
                      newWidth = 68;
                      currMap = CarC;
                      break;
                  }

                  let map;
                  switch (zone) {
                    case 'A':
                      map = <MapA />;
                      break;
                    case 'B':
                      map = <MapB />;
                      break;
                    case 'C':
                      map = <MapC />;
                      break;
                  }

                  const newSlots = slots.map((slot, ix) => {
                    const [vehicle] = vehicles.filter((e) => e.position === slot.position);
                    if (vehicle) {
                      const { top, left, position, rotate } = vehicle;
                      const width = newWidth;
                      return (
                        <React.Fragment key={position + ix}>
                          <DetailFloorStyled
                            key={position + ix}
                            title={
                              <Flex justify="space-between">
                                <Typography.Title
                                  id="location"
                                  level={5}
                                  className="detail-slot-title my-0"
                                  style={{ color: token.green7 }}>
                                  {`Khu ${zone} - ${position}`}
                                </Typography.Title>
                                <Tag color="cyan">
                                  {dayjs(slot?.parkingTurn?.start).format('L LTS')}
                                </Tag>
                              </Flex>
                            }
                            content={
                              <DetailSlot
                                {...vehicle}
                                zone={zone}
                                vehicle={slot?.parkingTurn?.vehicle}
                                driver={slot?.parkingTurn?.vehicle?.driver}
                              />
                            }
                            overlayInnerStyle={{
                              border: '1px solid',
                              borderColor: token.cyan,
                              backgroundColor: token.cyan1,
                              boxShadow: token.boxShadowSecondary
                            }}
                            getPopupContainer={() => document.querySelector('#root')}>
                            <img
                              id={position}
                              key={zone + position + ix}
                              {...vehicle}
                              className="image-container"
                              src={currMap}
                              style={{
                                transform: `rotate(${rotate}deg)`,
                                width,
                                top,
                                left
                              }}
                            />
                          </DetailFloorStyled>
                        </React.Fragment>
                      );
                    }
                  });

                  return (
                    <>
                      {map} {newSlots}
                    </>
                  );
                }, [slots])}
              </div>
            </MapInteractionCSS>
          </Spin>
        </TransformBlock>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Map;