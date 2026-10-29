import jwt from "jsonwebtoken"

export function auth(req, res, next) {
    const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: "Token required!"
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            error: "Authentication is not configured"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = String(decoded.userId);
        return next();
    } catch {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
}
