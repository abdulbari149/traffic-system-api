const getTimelineDateQuery = (req, res, next) => {
  const date = new Date();
  let monthlyDate = new Date(date.getFullYear(), date.getMonth(), );
  let yearlyDate = new Date(date.getFullYear(), 0, 1)
  res.locals.monthlyDate = monthlyDate;
  res.locals.yearlyDate = yearlyDate
  next();
};
exports.getTimelineDateQuery= getTimelineDateQuery