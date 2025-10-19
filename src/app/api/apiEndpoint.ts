export class APIEndpoint {
  static BASE = "/api";

  static POST_LOG_IN = `${this.BASE}/auth/login`;

  static POST_LOG_OUT = `${this.BASE}/auth/logout`;

  static POST_REFRESH = `${this.BASE}/auth/refresh-token`;

  static POST_ME = `${this.BASE}/auth/me`;

  static API_USER = `${this.BASE}/user`;

  static API_PERMISSION = `${this.BASE}/permission`;

  static API_ROLE = `${this.BASE}/role`;

  static API_ATTRIBUTE = `${this.BASE}/attribute`;

  static API_OPTION = `${this.BASE}/option`;

  static API_BRAND = `${this.BASE}/brand`;

  static API_PRODUCT_CATEGORY = `${this.BASE}/product-category`;

  static API_LANGUAGE = `${this.BASE}/language`;

  static API_PRODUCT_TAG = `${this.BASE}/product-tag`;

  static API_PRODUCT = `${this.BASE}/product`;
}
