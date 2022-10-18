const fs =require('fs')
const path =require('path')
const xml2js =require('xml2js');

const parser =new xml2js.Parser();

const builder =new xml2js.Builder({
    headless: true,
    allowSurrogateChars: true,
    cdata: true
})

const currdir =path.join(__dirname, "src/objects")

fs.readdir(currdir, 'utf-8', (error, file)=>{
    if(error){console.log(error)}
    
    file.forEach((el, index)=>{

        el =currdir +"/" +el
        
        // make app like paystand , versa pay
        // make app like intergrator.io

        fs.readFile(el, {encoding: 'utf-8'}, (error, data)=> {
            if(error){console.log(error)}
            
            parser.parseString(data, (err, res)=> {
                if(err){console.log(err)}
                else{
                    if(res['savedsearch']){
                        // console.log(res['savedsearch']['$']['scriptid'])
                    }
                    if(res['savedcsvimport']){
                        
                        let importnames =[
                            'Journal Entry Import Mapping' 
                            ,'Trial Balance at Go-Live (Consol.) Import Mapping'
                            ,'Historical Trial Balance (Consol.) Import Mapping'
                        ]

                        let scriptid =res['savedcsvimport']['$']['scriptid']
                        let ssrcipt =res['savedcsvimport']['runserversuitescript'][0]
                        let importname =res['savedcsvimport']['importname'][0]

                        // delete res["savedcsvimport"]['somethingnewandfriendly']
                        if (importnames.indexOf(importname) >=0){
                            
                            console.log(importname)
                            console.log(scriptid)
                            console.log(ssrcipt)

                            res["savedcsvimport"]['runserversuitescript'] ='T'

                            let xml =builder.buildObject(res)

                            fs.writeFile(el, xml,  "utf-8", (err, data)=>{
                                if(err){
                                    throw err
                                }else{
                                    console.log('XML sucessfully updated', importname)
                                }
                            })

                        }else{
                            fs.unlink(el, (err)=>{
                                if(err){
                                    throw err
                                }else{
                                    console.log('file deleted', scriptid)
                                }
                            })
                        }
                    }
                }
            })
       })
    })
})