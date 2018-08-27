function fetchMultivers(url) {
  return fetch( new Request(url, {
    headers: {
      user: localStorage.getItem('user')
    }
  }) )
}
