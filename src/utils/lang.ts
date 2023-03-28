import data from './data/localization.json';

const LOCALE = 'ru';

const translate = (key: keyof typeof data): string => data[key][LOCALE];

export default translate;
