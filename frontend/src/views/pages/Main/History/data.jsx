import dayjs from 'dayjs';
import { CustomedImage } from '~/views/components';

export const getColumns = ({ pageSize, pageIndex }) => {
  return [
    {
      title: '#',
      dataIndex: 'key',
      width: 60,
      render: (_, __, index) => (pageIndex - 1) * pageSize + index + 1
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('L LTS'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Tên sự kiện',
      dataIndex: 'name',
      key: 'eventName',
      render: (text) => text == 'in' ? 'Xe vào' : 'Xe ra',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Vị trí',
      dataIndex: ['parkingTurnId', 'position'],
      key: 'position'
    },
    {
      title: 'Phí',
      dataIndex: ['parkingTurnId', 'fee'],
      key: 'fee',
      sorter: (a, b) => a.parkingTurnId.fee - b.parkingTurnId.fee,
      render: (text, item) => {
        const names = ['out', 'outSlot'];
        const isFee = names.includes(item.name);
        return isFee && text;
      }
    },
    {
      title: 'Tên người lái',
      dataIndex: 'driverName',
      key: 'driverName'
    },
    {
      title: 'Biển số xe',
      dataIndex: 'licensePlate',
      key: 'licensePlate'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, item) => <CustomedImage src={item?.parkingTurnId?.image} width={40} height={40} />
    }
  ];
};