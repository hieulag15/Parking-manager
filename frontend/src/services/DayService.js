import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

export default {
  setup: () => {
    dayjs.locale("vi");
    dayjs.extend(customParseFormat);
    dayjs.extend(localizedFormat);
  },
};
