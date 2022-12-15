// todo should be creatable file like script.js, when backend start
console.log('i am coming from backend server')
var url = 'http://localhost:5000/api/v1/constructor'

fetch(`${url}/navigation-routes`).then(res => {
  if (res.data.functions) {
    window.initConstructorFunction = res.data.functions
    res.data.functions.initConstructor()
  }
})