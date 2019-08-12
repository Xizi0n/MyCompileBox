const cmd = require('node-cmd');
const fs = require('fs');
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const crypto = require('crypto');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 8888;

// usercode/script.sh
const path = __dirname;
const timeout = 20;
const vmname = 'virtual_machine';
const statement = `docker run --rm -d -i -t -v ${path}:/usercode ${vmname} usercode/script.sh`;
console.log(statement);

const generateRandomFolderName = (size) => {
    return crypto.randomBytes(size).toString('hex');
}

const prepare = () => {
    const folderName = generateRandomFolderName(16);
    //console.log(`mkdir ${path}/${folderName} && cp ${path}/Scripts/* ${path}/${folderName} && chmod 777 ${path}/${folderName}`);
    cmd.get(`mkdir ${path}/temp/${folderName} && cp ${path}/Scripts/* ${path}/temp/${folderName} && chmod 777 ${path}/${folderName}`, (err, data, stderr) => {
        if(!err && !stderr){
            console.log('sucessful preparation !!! yayy');
        }
    });
};

app.get('/compile', (request, response) => {


    const language = request.body.language;
    const code = request.body.code;
    const stdin = request.body.stdin;
    console.log(language, code, stdin)

    cmd.get( statement , (err , data, stderr) =>{
        console.log(data);
        console.log(__dirname);
        prepare();
        const containerId = data;
        console.log('ContainerID: ' + containerId);
        let seconds = 0;
        const timer = setInterval( ( )=> {
            seconds++;
            fs.readFile("./temp/user/completed.txt", (err, data) => {
                if(data){
                    console.log('Compile completed');
                    console.log(data.toString());
                    response.send(data.toString());
                    clearInterval(timer);
                    
                }
                if(err){
                    console.log('Error!')
                    console.log(err);
                }
            })
        }, 1000)
    });
    console.log('compile request arrived @ ' + (new Date()).toISOString().replace(/[^\d]/g,'').slice(0, -3) )
    //response.send("I'm working")
})



app.listen( port, () => {
    console.log(`Server is up, and listening on port: ${port}`);
})


