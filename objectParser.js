const fs =require('fs')
const path =require('path')
const xml2js =require('xml2js');
const converter =require('json-2-csv')
const {inactiveUsers} =require('./inactiveUsers');

const parser =new xml2js.Parser();
const builder =new xml2js.Builder({
    headless: true,
    allowSurrogateChars: true,
    cdata: true
})

const currdir =path.join(__dirname, "src/objects")
let globalUpdatedRecords =[]

console.log(inactiveUsers)

const importFilter =(importnames, importname, el, res)=>{
    if (importnames.indexOf(importname) >=0){
                        
        console.log(importname)
        console.log(scriptid)
        console.log(ssrcipt)

        res["savedcsvimport"]['runserversuitescript'] ='T'

        globalUpdatedRecords.push(res)
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

fs.readdir(currdir, 'utf-8', (error, file)=>{
    if(error){console.log(error)}

    file.forEach((el, index)=>{

        el =currdir +"/" +el
        filesync =fs.readFileSync(el, 'utf-8', (err, text)=>{})

        parser.parseString(filesync, (err, res)=> {
            if(err){console.log(err)}
            else{        
                if(res['savedcsvimport']){
                    let importnames =[
                        'Journal Entry Import Mapping' 
                        ,'Trial Balance at Go-Live (Consol.) Import Mapping'
                        ,'Historical Trial Balance (Consol.) Import Mapping'
                    ]

                    let scriptid =res['savedcsvimport']['$']['scriptid']
                    let ssrcipt =res['savedcsvimport']['runserversuitescript'][0]
                    let importname =res['savedcsvimport']['importname'][0]

                    console.log(importname)
                    console.log(scriptid)
                    console.log(ssrcipt)

                    // importFilter(importnames, importname, el, res)
                    res["savedcsvimport"]['runserversuitescript'] ='T'

                    globalUpdatedRecords.push(res)
                    let xml =builder.buildObject(res)

                    fs.writeFile(el, xml,  "utf-8", (err, data)=>{
                        if(err){
                            throw err
                        }else{
                            console.log('XML sucessfully updated', importname)
                        }
                    })
                }
            }
        })
    }) 

    globalUpdatedRecords.forEach((el, index)=>{
        // console.log(el)
    })

    converter.json2csv(globalUpdatedRecords, (err, csv)=>{
        if(err){throw err}
        fs.writeFileSync('tester.csv', csv)
    })

})
