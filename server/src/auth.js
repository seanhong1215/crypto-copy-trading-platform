// 認證 / Authentication —— bcrypt 密碼雜湊 + JWT
//
// 安全重點:
//   - 密碼「絕不」明文儲存,一律用 bcrypt 雜湊(自帶 salt)。
//   - 登入成功後簽發 JWT,後續請求靠 Bearer token 驗證,不再帶密碼。
//   - JWT_SECRET 由環境變數注入,程式內只放開發用預設值。

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'finfolio-dev-secret-change-me';
const JWT_EXPIRES_IN = '7d';
const BCRYPT_ROUNDS = 10;

function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Express 中介層:驗證 Authorization: Bearer <token>,通過則掛上 req.userId。
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'missing_token' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

module.exports = { hashPassword, verifyPassword, signToken, requireAuth };
