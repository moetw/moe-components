import moment from 'moment/src/moment';
import 'moment/src/locale/zh-tw';
import 'moment/src/locale/ja';

moment.locale(window.navigator.userLanguage || window.navigator.language);
export default moment;
