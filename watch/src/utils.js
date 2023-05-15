import pathx from 'path';

function urlJoin(base, path, query) {
    const urlp = new URL(base);
  
    urlp.pathname = pathx.join(urlp.pathname, path);
  
    if (query) {
      for (const key in query) {
        urlp.searchParams.set(key, query[key]);
      }
    }
  
    return urlp.href;
  }


  export default {
      urlJoin,
  };
