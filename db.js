class DB {

    get(collection, f) {
        console.log('GET')
        let url = base + database + "/collections/" + collection + "?apiKey=" + apiKey
        let request = new XMLHttpRequest()
        request.open('GET', url)
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            f(this.response)
          } else {
            console.log(this.status)
            console.log(this.response)
          }
        }
        request.onerror = function() {
            console.log(this.status)
            console.log(this.response)
        }
        request.send()
    }

    insert(collection, data) {
        console.log("INSERT")
        let url = base + database + "/collections/" + collection + "?apiKey=" + apiKey
        let form = new FormData()
        for(let d in data) {
            form[d] = data[d]
        }
        let request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader('Content-Type', 'application/json')
        request.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            console.log(this.response)
          } else {
            console.log(this.status)
            console.log(this.response)
          }
        }
        request.onerror = function() {
            console.log(this.status)
            console.log(this.response)
        }
        request.send(JSON.stringify(data))
    }

}

