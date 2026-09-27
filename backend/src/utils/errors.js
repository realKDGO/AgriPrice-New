export class AppError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
export const requireRecord = (record) => {
  if (!record) throw new AppError(404, "Record not found.");
  return record;
};
export const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export const ok = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });
