module.exports = function(grunt) {
    var packageJson = require('./package.json');

    grunt.initConfig({
        basename: packageJson.name,
        version: packageJson.version,
        homepage: packageJson.homepage,
        paths: {
            dest: 'dist',
            src: 'src'
        },
        concat: {
            js: {
                files: [{
                    src: '<%= paths.src %>/*.js',
                    dest: '<%= paths.dest %>/<%= basename %>.js'
                }]
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: true,
                    compress: true,
                    banner: "/**\nOpenLayers3 map scale control\nVersion: <%= version %>\nHomepage: <%= homepage %>\n*/\n"
                },
                files: [{
                    src: '<%= paths.dest %>/<%= basename %>.js',
                    dest: '<%= paths.dest %>/<%= basename %>.min.js'
                }]
            }
        },
        umd_wrapper: {
            build: {
                files: [{
                    src: '<%= paths.src %>/module',
                    dest: '<%= paths.dest %>/<%= basename %>.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-umd-wrapper');

    grunt.registerTask("default", ['concat', 'umd_wrapper:build', 'uglify:build']);
};
