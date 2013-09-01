module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      dist: {
        options: {
          almond: true,
          mainConfigFile: 'js/main.js',
          name: '../js/main',
          out: 'dist/main.min.js',
          paths: {
            jquery: 'jquery/jquery'
          }
        }
      }
    },
    less: {
      dist: {
        options: {yuicompress: true},
        files: {
          'dist/main.min.css': 'less/main.less'
        }
      }
    },
    watch: {
      options: {interrupt: true},
      scripts: {
        files: ['**/*.js', '!dist/**', '!Gruntfile.js'],
        tasks: ['requirejs']
      },
      less: {
        files: ['**/*.less', '!dist/**'],
        tasks: ['less']
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['compile']
      }
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('compile', ['requirejs', 'less']);

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['compile']);
};
