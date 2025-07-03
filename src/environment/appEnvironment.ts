export class AppEnvironment {
    static MODE = process.env.NODE_ENV || "development"
    static SSL_CERT_PATH = process.env.SSL_CERT_PATH || ""
    static JWT_SECRET = process.env.JWT_SECRET || "my-secret"
    static POSTGRES_URL = process.env.POSTGRES_URL || ""
    static ACCESS_TOKEN_COOKIE_KEY = 'accessToken'
    static REFRESH_TOKEN_COOKIE_KEY = 'refreshToken'
}