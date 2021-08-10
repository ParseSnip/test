//compile a query string to search for products
document.getElementById('search').onclick = function(){
  let textValue = document.getElementById('search-terms').value
  let priceValue = document.getElementById('price').value
  let colorValue = document.getElementById('color').value.toLowerCase()

  //if only textvalue is filled 
  if(priceValue === '' && colorValue === ''){
     axios.get(`/api/products/search?keywords=${textValue}`)
    .then(showResults)
  }else{
  //otherwise
  let rootQuery = `/api/products/detailSearch?`
  let priceQuery = ''
  let colorQuery = ''

  //concat text value to query string
  if(textValue){
    rootQuery += `name[val]=${textValue}`
  }

  //concat price query
  if(priceValue){
    //if text exists on the query string start the next addition with & signifying another param
    if(textValue){
      priceQuery ='&'
    } 
    priceQuery += `price[op]=lt&price[val]=${priceValue}`
  }

    //concat color query
  if(colorValue){
    if(priceValue || textValue){
      colorQuery = '&'
    }

    colorQuery += `color[op]=eq&color[val]=${colorValue}`
  }
  const query = `${rootQuery}${priceQuery}${colorQuery}`

  axios.get(query).then(showResults)
}
}


function showResults({ data }) {
  document.querySelector("h2").className = "hidden";

  const productList = document.getElementById("product-list");
  if (productList) {
    productList.remove();
  }

  if (data.length === 0) {
    document.querySelector("h2.hidden").className = "";
  }

  const template = document.querySelector("#list-result");
  const clone = template.content.cloneNode(true);

  const ul = clone.querySelector("ul");
  data.forEach((d) => {
    const li = clone.querySelector("li").cloneNode(true);
    const id = li.querySelector("#product-id");
    id.textContent = d.id;
    id.onclick = (e) => {
      document.getElementById("product-id").value = e.currentTarget.textContent;
    };
    li.querySelector("#product-name").textContent = d.name;
    li.querySelector("#product-price").textContent = d.price;

    ul.appendChild(li);
  });

  results.appendChild(clone);
}
