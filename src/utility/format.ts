
import * as moment from 'moment';
import 'moment-timezone';

export const formatNumber = (value: number) => {
  return value.toLocaleString(undefined, {maximumFractionDigits: 8});
};

export const formatTime = (value: string) => {
  var time = value.length <= 10 ? Number(value) * 1000 : Number(value);
  var timezone = moment.tz.guess();
  return moment.tz(Number(time), timezone).format('MM/DD/YYYY HH:mm');
};
