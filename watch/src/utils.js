import pathx from 'path';

function urlJoin(base, path, { query, replace }) {
  const urlp = new URL(base);

  if (replace) {
    urlp.pathname = path;
  } else {
    urlp.pathname = pathx.join(urlp.pathname, path);
  }

  if (query) {
    for (const key in query) {
      urlp.searchParams.set(key, query[key]);
    }
  }

  return urlp.href;
}

function dateDiff(d1, { seconds, minutes, d2 }) {
  let limit = seconds || minutes * 60;
  if (!d1) return true;
  if (!d2) d2 = new Date();
  const diff = Math.abs(d1 - d2) / 1000;
  return diff >= limit;
}

export {
  urlJoin,
  dateDiff,
};
