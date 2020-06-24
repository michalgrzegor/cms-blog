export default class TokenHandler {
  constructor() {
    this.TOKEN = null;
    this.isExpired = true;
  }

  setTokens(response) {
    console.log(response);
    this.TOKEN = response.access_token;
    this.isExpired = false;
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('refresh_token_created_at', response.created_at);
    localStorage.setItem('refresh_token_expired_time', response.expires_in);
  }

  setIsExpired() {
    if (localStorage.getItem('refresh_token')) {
      const tokenCreationTime = new Date(
        localStorage.getItem('refresh_token_created_at')
      ).getTime();
      const NowMs = new Date().getTime();
      const expTime = localStorage.getItem('refresh_token_expired_time') * 1000;
      this.isExpired = NowMs - tokenCreationTime > expTime;
    } else {
      this.isExpired = true;
    }
    console.log(this.isExpired);
  }

  setExpireTime() {
    const tokenCreationTime = new Date(localStorage.getItem('refresh_token_created_at')).getTime();
    const NowMs = new Date().getTime();
    const expTime = localStorage.getItem('refresh_token_expired_time') * 1000;
    if (NowMs - tokenCreationTime < expTime) {
      setTimeout(() => {
        this.isExpired = true;
      }, expTime - NowMs + tokenCreationTime);
    }
  }

  getToken() {
    return this.TOKEN;
  }

  getIsToken() {
    return this.TOKEN !== null;
  }

  getIsExpired() {
    return this.isExpired;
  }

  getIsRefresh() {
    return (
      localStorage.getItem('refresh_token') && localStorage.getItem('refresh_token') !== undefined
    );
  }
}
