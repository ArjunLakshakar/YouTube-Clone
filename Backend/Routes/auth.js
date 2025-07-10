import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, "secret123"); 
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
