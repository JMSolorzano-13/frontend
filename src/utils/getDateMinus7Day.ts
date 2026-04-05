
import moment from 'moment';
export function getDateMinus7Days(): string {
    const dateMinus7Days = moment().subtract(7, 'days');
    return dateMinus7Days.format('YYYY-MM-DD');
}