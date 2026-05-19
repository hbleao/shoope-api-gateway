export function allowedOrigins(origin, callback) {
	if (!origin) return callback(null, true);

	const origins = process.env.CORS_ORIGIN?.split(",") || ["*"];
	const allowedOrigin = origins.includes("*") || origins.includes(origin);

	if (allowedOrigin) return callback(null, true);

	new Error("Origin is not allowed by CORS");
}
