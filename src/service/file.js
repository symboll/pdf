const path = require('path');
const fs = require('fs')
const PDFPaser = require('pdf-parse')
const xlsx = require('node-xlsx');
const pattern = require('./utils')

class UploadFile {
  constructor(){}
  async upload (ctx) {
    const file = ctx.request?.files?.file;
    const basename = path.basename(file.filepath);

    const url = await new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, `../../public/uploads/${basename}`), (err, pdfBuffer) => {
        if(err){
          console.log('err,',err)
          return
        }
  
        PDFPaser(pdfBuffer).then(pdfData => {
          const res = pdfData.text.split('\n').filter(item => item)
          console.log(res)
  
          /**
           * Customer order number
           * 客户订单号
           */
          const customer = res.find(item => pattern.customer.test(item))
  
          /**
           * Order number
           * 订单号
           */
          const order = res.find(item => pattern.order.test(item))
  
  
          /**
           * Delivery  number
           * 送货编号
           */
          const delivery = res.find(item => pattern.delivery.test(item))
  
          const list = [
            ['客户订单号','订单号','送货编号'],
            [customer,order,delivery]
          ]
  
  
          const firstIndex = res.findIndex(item => pattern.multiple.test(item))
          const lastIndex = res.findLastIndex(item => pattern.multiple.test(item))
          let sub = []
          if (firstIndex > 0 && lastIndex > 0){
            sub = res.slice(firstIndex - 1, lastIndex + 1)
          }
   
          if(sub.length){
            const subTitle = ['产品编号','批号','',	'生产日期',	'失效日期']
            list.push(subTitle)
            let product = ''
            for (let i = 0;  i < sub.length; i++) {
              if(!pattern.multiple.test(sub[i])){
                product = sub[i] 
              } else {
                sub[i].replace(pattern.product, (match, p1, p2, p3, p4) => {
                  list.push([product,p1,p2,p3,p4])
                  return ''
               })
              }
            }
          }
          const buffer = xlsx.build([{name: '送货单', data: list}]);
          const name = basename.split('.')[0]
          fs.writeFileSync(path.resolve(__dirname, `../../public/uploads/${name}.xlsx`), buffer, 'binary');
    
          resolve(`${ctx.origin}/uploads/${name}.xlsx`)
        })
      })
    })


    ctx.body = {
      url
    }
  }
}

module.exports = UploadFile