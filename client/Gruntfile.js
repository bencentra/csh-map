module.exports = function(grunt) {

  grunt.initConfig({
    // Clean build directory
    clean: {
      dev: ['dist/csh-map-ui.js'],
      dist: ['dist/csh-map-ui.min.js']
    },
    // Watch for changes in source files
    watch: {
      src: {
        files: ['src/**/*.js', 'src/**/*.html'],
        tasks: ['browserify:src'] 
      }
    },
    // Launch a server to test locally
    connect: {
      server: {
        options: {
          port: 8888,
          keepalive: true,
          open: 'http://localhost:8888/test/demo'
        }
      }
    },
    // Create ES5 bundle from ES6 source
    browserify: {
      src: {
        files: {
          'dist/csh-map-ui.js': ['src/csh-map.js']
        },
        options: {
          transform: ['stringify', 'babelify']
        }
      }
    },
    // Minify ES5 bundle
    uglify: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/csh-map-ui.min.js': 'dist/csh-map-ui.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['clean:dev', 'browserify', 'watch']);
  grunt.registerTask('build', ['clean:dist', 'browserify', 'uglify']);
  grunt.registerTask('serve', ['connect']);

};
