function rtrim(x, characters) {
  var end = x.length - 1;
  while (characters.indexOf(x[end]) >= 0) {
    end -= 1;
  }
  return x.substr(0, end + 1);
}

function ltrim(x, characters) {
  var start = 0;
  while (characters.indexOf(x[start]) >= 0) {
    start += 1;
  }
  return x.substr(start);
}

function pathJoin(base, relative) {
  base = rtrim(base, '/');
  relative = rtrim(ltrim(relative, '/'), '/');
  return `${base}/${relative}`;
}

function urlJoin(base, path, { query, replace }) {
  const urlp = new URL(base);

  if (replace) {
    urlp.pathname = path;
  } else {
    urlp.pathname = pathJoin(urlp.pathname, path);
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
  pathJoin,
  urlJoin,
  dateDiff,
};
