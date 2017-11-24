function results() {
  let results = document.getElementById('results')
  let br = document.createElement('br')
  let ls = allStorage()
  for (let i = 0; i < ls.length; i++){
    let forms = document.createElement('fieldset')
    let legend = document.createElement('legend')
    let child_legend = document.createTextNode("Form #" + (i+1).toString())
    legend.appendChild(child_legend)
    forms.appendChild(legend)
    let table = document.createElement('table')
    data = JSON.parse(ls[i])
    for (let d = 0; d < data.length; d++) {
      for (j in data[d]){
        let tr = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        // let elm = document.createElement('p')
        // let child_elm = document.createTextNode(j + ': ' + data[d][j] + "\n")
        let td1_child = document.createTextNode(j)
        let td2_child = document.createTextNode(data[d][j])
        td1.appendChild(td1_child)
        td2.appendChild(td2_child)
    
        // elm.appendChild(child_elm)
        // elm.appendChild(br)
        // elm.appendChild(br)
        // forms.appendChild(elm)
        tr.appendChild(td1)
        tr.appendChild(td2)
        table.appendChild(tr)
        forms.appendChild(br)
      }
    }
    
    results.appendChild(br)
    results.appendChild(br)
    forms.appendChild(table)
    results.appendChild(forms)
  }
}