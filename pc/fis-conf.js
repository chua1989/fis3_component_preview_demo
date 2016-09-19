var path = require('path');

// npm install [-g] fis3-hook-commonjs
fis.hook('commonjs', {});

// fis.set('project.fileType.text', 'svn,.svn');
fis.set('project.ignore', []);

fis.match('**mod.*.js', {
        isMod: true
    })
    .match('common/module/**.js', {
        isMod: true
    })
    .match('common/js/**.js', {
        isMod: true
    })
    .match('common/js/common.js', {
        isMod: false
    });

fis.match('**/_*.scss', {
        release: false
    })
    .match('**.scss', {
        rExt: '.css',
        parser: fis.plugin('node-sass-nfd', {})
    });


fis.media('dev')
    .match('*.{png,jpg,gif,js,css,scss,tpl}', {
        url: '/static$0'
    })
    .match(/\/(.+)\.tpl$/, { // js 模版一律用 .tpl 作为后缀
        isMod: true,
        rExt: 'js',
        id: '$1.tpl',
        url: '/static$0.tpl',
        moduleId: '$1.tpl',
        release: '$0.tpl', // 发布的后的文件名，避免和同目录下的 js 冲突
        parser: fis.plugin('imweb-tplv2')
    })
    .match('::package', {
        postpackager: fis.plugin('loader', {
            allInOne: false,
            processor: {
                '.html': 'html',
                '.jsp': 'html'
            },
            useInlineMap: false,
            resourceType: 'mod'
        })
    })
    .match('*', {
        deploy: fis.plugin('nfd-deliver-dist-m', {
            to: '../pc-dev',
            html: 'all',
            jspFrontPath: 'nfd/front/src/main/webapp/WEB-INF',
            jspUserPath: 'nfd/user/src/main/webapp/WEB-INF',
            rootPath: path.resolve(__dirname, '../../../../..')
        })
    });
