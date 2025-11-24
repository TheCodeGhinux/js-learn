export const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress

  const info = {
    timestamp,
    method,
    url,
    ip
  }

  console.log(info);

  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    
  })
  next()
}

export const requestId = (req, res, next) => {
  req.id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  res.setHeader(`X-Request-ID`, req.id)
  next()
}

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {

  const rateLimitStore = new Map()
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if(!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, {count: 2, resetTime: now + windowMs})
      return next()
    }

    const record = rateLimitStore.get(ip)

    if(now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;

      return next();
    }

    record.count++

    if(record.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many request, please try again",
        retryAfter: Math.ceil((record.resetTime - now)/ 1000)
      })
    }

    next();
  }
} 
export const authMiddleware = (req, res, next) => {

  console.log(`You are not authorized`);

  res.status(401).json({
    success: false,
    message: 'You are not authorized',
  });
  
  next()
}