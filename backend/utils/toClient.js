/**
 * Convert a Mongoose document (or lean object) into the exact shape the
 * existing frontend already expects.
 *
 * The frontend identifies records with a numeric `id` from its old localStorage
 * seed data and compares with `===`. Exposing the Mongo ObjectId string as `id`
 * keeps every call site working without touching the components, and React keys
 * / equality checks keep working because the value is stable per record.
 */
export function toClient(doc) {
  if (doc === null || doc === undefined) return doc

  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc }
  const id = String(obj._id ?? obj.id)

  delete obj._id
  delete obj.__v

  return { ...obj, id }
}

/** Map a list of documents through `toClient`. */
export function toClientList(docs) {
  return Array.isArray(docs) ? docs.map(toClient) : []
}