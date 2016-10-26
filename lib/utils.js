import pathToRegexp from 'path-to-regexp';
import options from '../options';

const urlMaps = options.urlMaps;

export function mapUrl(url) {
  for(let k in urlMaps) {
    if (pathToRegexp(k).test(url)) {
      return urlMaps[k];
    }
  }
  return null;
}