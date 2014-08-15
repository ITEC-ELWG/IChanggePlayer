'use strict';

var paths = {
    js: ['*.js', 'app/**/*.js'],
    html: ['public/**/views/**', 'server/views/**', 'packages/**/public/**/views/**', 'packages/**/server/views/**'],
    css: ['public/**/css/*.css', '!public/system/lib/**', 'packages/**/public/**/css/*.css'],
};

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        config: config,
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            livereload: {
                files: [
                    '{,*/}*.html',
                    '<%= config.app %>/scripts/{,*/}*.js',
                    '<%= config.app %>/styles/{,*/}*.css',
                    'Gruntfile.js',
                    'static/{,*/}*.{css,js,png,jpg,gif,svg}'
                ],
                // tasks: ['jshint'],
                options: {
                    livereload: 35729
                }
            }
        },
        // 将jplayer，jplayer的playlist扩展和封装模块合并为一个文件
        concat: {
            dist: {
                src: [
                    'app/scripts/lib/jquery.jplayer.js',
                    'app/scripts/lib/jplayer.playlist.js',
                    'app/scripts/lib/ichangge-player.js'
                ],
                dest: 'dist/js/ichangge-player.js'
            }
        },
        // 复制必要的静态文件到发布文件夹中
        copy: {
            css: {
                expand: true,
                cwd: '<%= config.app %>/styles/lib/',
                src: 'ichangge-player.css',
                dest: '<%= config.dist %>/css/'
            },
            img: {
                expand: true,
                cwd: '<%= config.app %>/images/',
                src: '*',
                dest: '<%= config.dist %>/images/'
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside  
                hostname: 'localhost',
                base: '.'
            },
            livereload: {
                options: {
                    middleware: function(connect, options) {
                        return [
                            require('connect-livereload')({
                                port: 35729
                            }),
                            // Serve static files.  
                            connect.static(options.base),
                            // Make empty directories browsable.  
                            connect.directory(options.base)
                        ];
                    }
                }
            },
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['app/**', 'node_modules/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            run: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
    });

    grunt.registerTask('default', ['concurrent:run']);
    grunt.registerTask('deploy', ['concat', 'copy']);
};
