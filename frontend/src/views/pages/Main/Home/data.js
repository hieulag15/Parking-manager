import dayjs from 'dayjs';

export const DefaultPosition = [
  {
    order: 1,
    col: 1,
    colSpan: 4,
    rowSpan: 12
  },
  {
    order: 2,
    col: 5,
    colSpan: 4,
    rowSpan: 12
  },
  {
    order: 3,
    col: 9,
    colSpan: 4,
    rowSpan: 12
  },
  {
    order: 4,
    col: 1,
    colSpan: 12,
    rowSpan: 14
  },
  {
    order: 4,
    col: 1,
    colSpan: 12,
    rowSpan: 14
  }
];

export const DefaultNumberStatisChart = () => {
  let rs = [];
  const zones = ['A', 'B', 'C'];

  for (let i = 0; i < 7; i++) {
    zones.map((zone) => {
      rs.push({
        zone,
        value: Math.random() * 100,
        date: `0${i}/12/2023`
      });
    });
  }

  return rs;
};

export const DefaultEvents = () => {
  let rs = [];
  const types = ['in', 'out'];
  const zones = ['A', 'B', 'C'];

  for (let i = 0; i < 10; i++) {
    const type = types[Math.round(Math.random())];
    const zone = zones[Math.round(Math.random() * 2)];

    rs.push({
      time: dayjs(),
      type,
      zone,
      license: '58V1 793.70',
      driver: {
        name: 'Trần Trung Hậu',
        job: 'Giảng viên',
        department: 'khoa Công nghệ thông tin',
        phone: '0357647771'
      }
    });
  }

  return rs;
};
