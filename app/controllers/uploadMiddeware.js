import multer from 'koa-multer';
import compose from 'koa-compose';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import promise from 'bluebird';
let symlinkAsync = promise.promisify(fs.symlink);

let createStorageKey = function(file) {
  var date, day, time;
  date = new Date();
  time = date.getTime();
  return time + "-" + file.name;
};

export async function processUploadMiddleware(ctx, next) {
   const file = ctx.request.body.files.file;
   let key = ctx.request.body.fields.key;

    if (_.isUndefined(key)) {
      key = createStorageKey(file);
    }
   const reader = fs.createReadStream(file.path);
   const stream = fs.createWriteStream(path.join('resources/public/uploads/', key));
   reader.pipe(stream);

   let sym = await fs.symlink(path.resolve('./resources/public/uploads/'), path.resolve('./public/uploads/'), 'file', (err) => {
    if (err) {
      console.log(err);
      let isWin = /^win/.test(process.platform);
      if (!fs.existsSync('public/uploads/')){
          fs.mkdirSync('public/uploads/');
      }
      if (isWin) {
        const streamPublic = fs.createWriteStream(path.join('public/uploads/', key));
        reader.pipe(streamPublic);
      }
    }
   });

   ctx.body = {status: 200, data: {name: key, size: file.size}};
}

const upload = multer({ dest: 'resources/public/uploads/' });
export async function uploadMiddeware(ctx, next) {
  let result = await upload.single('file')(ctx, next);
  ctx.body = {status: 200, data: 1};
}
