var express = require("express");
var router = express.Router();
const qs = require('qs')

// module.exports = function (db) {
//   router.get('/products', (req, res)=>{
//     res.send(db.get('products').value())
//   })

//   router.post('/products', (req, res)=>{
//     const newProduct = req.body
//     res.send(db.get('products').insert(newProduct).write())
//   })

//   router.patch('/products/:id', (req, res)=>{
//       res.send(db.get('products').find({id: req.params.id}).assign(req.body).write())
//   })

//   router.get('/products/:id', (req, res)=>{
//     res.send(db.get('products').find({id: req.params.id}).value())
// })

// router.delete('/products/:id', (req, res)=>{
//   db.get('products').remove({id:req.params.id}).write()
//   res.status(204).send()
// })

//   return router;
// };

module.exports = function (db) {
  //chain the REST action to the router.route then you do not need to repass the same routes 
  router.route('/products')
   .get( (req, res)=>{
    res.send(db.get('products').value())
  })
  .post((req, res)=>{
    const newProduct = req.body

    const errors = []
    const allowedColors =[
      'red',
      'blue',
      'orange',
      'black',
      'brown',
      ''
    ]

    if(!newProduct.name){
      errors.push({
        field: 'name',
        error: 'required',
        message: 'Name is required'
      })
    }

    if(newProduct.price && isNaN(Number(newProduct.price))){
      errors.push({
        field:'price',
        error: 'type',
        message:'Price must be a number'
      })
    }

    if(newProduct.name.length > 25){
      errors.push({
        field:'name',
        error: 'type',
        message:'Name must be under 25 characters long'
      })
    }

    if(!allowedColors.some((_)=> _ === newProduct.color)){
      errors.push({
        field:'color',
        error: 'allowedValue',
        message:'Not an acceptable color'
      })
    }


    if(errors.length){
      return res.status(422).send(errors)
    }
    res.send(db.get('products').insert(newProduct).write())
  })
  router.route('/products/search').get((req,res)=>{
    //get query string from request object
    const keywords = req.query.keywords
  
    const result = db.get('products').filter(_ =>{
      //combine the description name and color into one string
      const fullText = _.description +_.name +_.color
      //get index of matching products..(if index = -1 no product exists)
      return fullText.indexOf(keywords) !== -1
    })
  
    res.send(result)
  })
  router.route('/products/detailSearch').get((req,res)=>{
    const query = qs.parse(req.query)

    const results = db.get('products').filter(_=>{
      return Object.keys(query).reduce((found,key)=>{
        const obj = query[key]
        switch(obj.op){
          case 'lt':
            found = found && _[key] < obj.val
            break;
          case 'eq':
            found = found && _[key] == obj.val
            break;
          default:
            found = found && _[key].indexOf(obj.val) !== -1
            break;
        }
        return found
      }, true)



    })
    res.send(results)
  })
  router.route('/products/:id')
  .patch((req, res)=>{
      res.send(db.get('products').find({id: req.params.id}).assign(req.body).write())
  })
  .get((req, res)=>{
     const result = db.get('products').find({id: req.params.id}).value()
     if(result){
       return res.send(result)
     }
     res.status(404).send()
})
  .delete((req, res)=>{
    //should handle improper id passed..
    let result = db.get('products').find({id:req.params.id}).value()
    if(!result){
      return res.status(404).send()
    }

    result = db.get('products').remove({id:req.params.id}).write()
    res.status(204).send()
})

  return router;
};

