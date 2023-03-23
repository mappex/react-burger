import data from './data/localization.json';

const LOCALE = 'ru';

const translate = (key: string): string => {
  // @ts-ignore
  return data[key][LOCALE];
};

export default translate;
