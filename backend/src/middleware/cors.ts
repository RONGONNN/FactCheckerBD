import type { RequestHandler } from 'express';

/** Lets the one configured frontend origin call the API from a browser. */
export function cors(allowedOrigin: string): RequestHandler {
  return (req, res, next) => {
    res.vary('Origin');
    if (req.headers.origin === allowedOrigin) {
      res.set('Access-Control-Allow-Origin', allowedOrigin);
      res.set('Access-Control-Allow-Methods', 'GET, POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  };
}
