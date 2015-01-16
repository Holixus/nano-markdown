module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "index.js", "dist/nanomd.min.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip(contents, {}).length;
          }
        },
        cache: "dist/.sizecache.json"
      }
    },
    uglify: {
      options: {
        banner: '',
        footer: ''
      },
      dist: {
        files: {
          './dist/nanomd.min.js': ['./index.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'dist/nanomd.min.js', dest: 'dist/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['uglify', 'compare_size']);
};
