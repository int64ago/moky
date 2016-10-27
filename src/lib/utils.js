import pathToRegexp from 'path-to-regexp';

export function mapUrlToPage(url, urlMaps) {
  for(let k in urlMaps) {
    if (pathToRegexp(k).test(url)) {
      return urlMaps[k];
    }
  }
  return null;
}