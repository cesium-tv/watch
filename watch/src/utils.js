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


export {
  urlJoin,
};
