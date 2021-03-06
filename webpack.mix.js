let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */
console.log(path.resolve(__dirname, './resources/sass'));

mix.webpackConfig({
  resolve: {
    alias: {
      styles: path.resolve(__dirname, './resources/sass') // relative to the location of the webpack config file!
    }
  }
});

mix.sass('resources/sass/app.scss', 'public/css')

   .copy('node_modules/bootstrap/dist/css/bootstrap.css', 'public/css')
   .copy('node_modules/bootstrap/dist/js/bootstrap.js', 'public/js')

   .copy('node_modules/jquery/dist/jquery.min.js', 'public/js')
   .sass('resources/sass/home.scss', 'public/css')
   .sass('resources/sass/login.scss', 'public/css')
  //  .copyDirectory('resources/public/img/', 'public/img')

   .js('resources/js/app.js', 'public/js/app.js')
   .sass('resources/sass/projects.scss', 'public/css')

   .copy('node_modules/font-awesome/fonts/', 'public/fonts')
   .copy('node_modules/font-awesome/css/font-awesome.min.css', 'public/css/font-awesome.min.css')

   .copy('node_modules/sortablejs/Sortable.min.js', 'public/js')
   .copy('node_modules/vuedraggable/dist/vuedraggable.js', 'public/js')

   .copy('node_modules/trix/dist/trix.js', 'public/js')
   .copy('node_modules/trix/dist/trix.css', 'public/css')

   .copy('node_modules/fullcalendar/dist/fullcalendar.min.js', 'public/js')
   .copy('node_modules/fullcalendar/dist/fullcalendar.min.css', 'public/css')

   .copy('node_modules/moment/min/moment.min.js', 'public/js')

   .setPublicPath('public');

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.ts(src, output); <-- Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.standaloneSass('src', output); <-- Faster, but isolated from Webpack.
// mix.fastSass('src', output); <-- Alias for mix.standaloneSass().
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.dev');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   uglify: {}, // Uglify-specific options. https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
