import multer from 'koa-multer';
import compose from 'koa-compose';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import promise from 'bluebird';
let symlinkAsync = promise.promisify(fs.symlink);

export async function processUploadMiddleware(ctx, next) {
   const file = ctx.request.body.files.file;
   const key = ctx.request.body.fields.key;

   const reader = fs.createReadStream(file.path);
   const stream = fs.createWriteStream(path.join('resources/public/img/', key));
   reader.pipe(stream);

   let sym = await fs.symlink(path.resolve('./resources/public/img/'), path.resolve('./public/img/'), 'file', (err) => {
     if (err) {
       console.log(err);
     }
   });

   ctx.body = {status: 200, data: file};
}

const upload = multer({ dest: 'resources/public/img/' });
export async function uploadMiddeware(ctx, next) {
  let result = await upload.single('file')(ctx, next);
  ctx.body = {status: 200, data: 1};
}
