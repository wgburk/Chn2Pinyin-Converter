 /**
  * Created by simon on 2019/01/09.
  */

const fs = require('fs');
let path = process.argv[2];

let readPinyinMap = function(path){
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
};

let copyFiles = function(src, dest){
    console.log('Copying files from: ' + src + ' to' + dest);
    // fs.writeFileSync(dest, fs.readFileSync(src));
    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
};
let readFiles = function(path, cb){
    let files = fs.readdirSync(path);

    files.forEach(function(file){
        cb(path, file);
    });
};

let strSearch = function(str, map){
    for(key in map){
        if(map[key].indexOf(str) != -1){
            return key;
        }
    }
    return false;
};

let reName = function(oldPath, newPath){
    console.log('Renaming files from: ' + oldPath + ' to' + newPath);
    fs.rename(oldPath, newPath, function(err) {
        if (err) {
            throw err;
        }
    });
};

let Converter = function(inputPath){
    //如果没有日志文件目录，则创建
    if(!fs.existsSync('./data')){
        fs.mkdirSync('./data', 0777);
    }

    let path = inputPath || './data';
    let map = readPinyinMap('./pinyin.json');

    if(inputPath){
        readFiles(path, function(path, file){
            copyFiles(path + '/' + file, './data/' + file);
        });
    }

    readFiles('./data', function(path, file){
        let fileName =  file.split('.')[0];
        let suffix = '.' + file.split('.')[1];
        let oldPath = path + '/' + file;
        let newPath = './data/';
        // let reg = new RegExp('[a-zA-Z0-9\- ]');

        let newFileName = '';
        for(let i = 0; i < fileName.length; i++){
            let str = strSearch(fileName[i], map);
            // if(reg.test(fileName[i])){
            //     newFileName += fileName[i];
            // }else if(str != false){
            //     newFileName += str;
            // }
            if(str != false){
                newFileName += str;
            }else{
                newFileName += fileName[i];
            }
        }
        // console.log(newFileName + suffix);

        reName(oldPath, newPath + newFileName + suffix);
    });
};
Converter(path);