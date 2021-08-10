document.getElementById('delete').onclick = function(e){
  e.preventDefault()
  const productId = document.getElementById('product-id').value

  axios.delete(`/api/products/${productId}`).then(processResult)
  .catch((err)=>{
    if(err.response.status === 404){
      window.alert('no product with id')
    }
  })
}

function processResult() {
  window.alert("Product deleted! mmkk");
}
