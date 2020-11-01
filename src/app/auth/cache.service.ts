export abstract class CacheService {
  protected getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key)
    if (data != null) {
      return JSON.parse(data)
    }
    return null
  }
  // tslint:disable-next-line: typedef
  protected setItem(key: string, data: object | string) {
    if (typeof data === 'string') {
      localStorage.setItem(key, data)
    }
    localStorage.setItem(key, JSON.stringify(data))
  }
  // tslint:disable-next-line: typedef
  protected removeItem(key: string) {
    localStorage.removeItem(key)
  }
  // tslint:disable-next-line: typedef
  protected clear() {
    localStorage.clear()
  }
}
