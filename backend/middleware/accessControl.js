export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export const ensureSchoolAccess = (req, res, next) => {
  const userSchoolId = req.user.schoolId.toString();
  const requestedSchoolId = req.params.schoolId || req.body.schoolId;
  
  if (requestedSchoolId && userSchoolId !== requestedSchoolId.toString()) {
    return res.status(403).json({ message: 'Access denied to this school data' });
  }
  next();
};
