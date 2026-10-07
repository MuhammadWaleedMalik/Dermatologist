/**
 * Defensive query-string sanitizer.
 *
 * Express can parse `?category[$ne]=x` into a JavaScript object. If that object
 * were passed straight into a Mongoose filter it would act as a query operator
 * (NoSQL injection). No endpoint in this API accepts object or array query
 * parameters, and no legitimate parameter contains a leading `$`, so both are
 * stripped before any handler runs.
 */
export function sanitizeQuery(req, _res, next) {
  const query = req.query
  if (query && typeof query === 'object') {
    for (const key of Object.keys(query)) {
      const value = query[key]
      if (typeof value === 'string') {
        if (value.includes('$')) delete query[key]
      } else if (value !== undefined) {
        // Arrays / nested objects (e.g. ?a[b]=c) are never valid here.
        delete query[key]
      }
    }
  }
  next()
}