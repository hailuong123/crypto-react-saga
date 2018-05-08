module.exports = function (grunt) { // jshint ignore:line
  'use strict'

  grunt.initConfig({
    watch: {
      less: {
        files: ['src/assets/less/*.less'],
        tasks: ['less:production', 'notify:less']
      }
    },
    notify: {
      less: {
        options: {
          title: 'Exchanges Cryptocurrency',
          message: 'Less finished running'
        }
      }
    },
    less: {
      production: {
        options: {
          compress: true
        },
        files: {
          'src/assets/css/main.min.css': 'src/assets/less/main.less',
        }
      }
    },
    // Validate CSS files
    csslint: {
      options: {
        csslintrc: 'src/assets/less/.csslintrc'
      },
      dist   : [
        'src/assets/css/main.css'
      ]
    },
  })
  // LESS Compiler
  grunt.loadNpmTasks('grunt-contrib-less')
  // Watch File Changes
  grunt.loadNpmTasks('grunt-contrib-watch')
  // Compress JS Files
  grunt.loadNpmTasks('grunt-contrib-uglify')
  // Include Files Within HTML
  grunt.loadNpmTasks('grunt-includes')
  // Optimize images
  grunt.loadNpmTasks('grunt-image')
  // Validate JS code
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-jscs')
  // Delete not needed files
  grunt.loadNpmTasks('grunt-contrib-clean')
  // Lint CSS
  grunt.loadNpmTasks('grunt-contrib-csslint')
  // Lint Bootstrap
  grunt.loadNpmTasks('grunt-bootlint')
  // Concatenate JS files
  grunt.loadNpmTasks('grunt-contrib-concat')
  // Notify
  grunt.loadNpmTasks('grunt-notify')
  // Replace
  grunt.loadNpmTasks('grunt-text-replace')

  // Linting task
  grunt.registerTask('lint', ['jshint', 'csslint', 'bootlint'])
  // JS task
  grunt.registerTask('js', ['concat', 'uglify'])
  // CSS Task
  grunt.registerTask('css', ['less:production', 'less:skins', 'replace'])
  // The default task (running 'grunt' in console) is 'watch'
  grunt.registerTask('default', ['watch'])
}