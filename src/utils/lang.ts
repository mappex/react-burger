import data from './data/localization.json';

const LOCALE = 'ru';

const translate = (key) => {
  return data[key][LOCALE];
};

export default translate;
