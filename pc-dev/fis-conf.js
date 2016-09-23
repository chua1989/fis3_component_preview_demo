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
    .match('common/js/base/**.js', {
        isMod: true
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
        prepackager: fis.plugin('component-preview',{
            wrap: '/v_components/wrap.html',//组件可视化原型文件，用来包裹组件可视化代码
            url: '/v_components.html', //目标文件
            COMPath: '/common/module',//组件集合目录
            moduleListInstead: 'instead of modules',//使用模块列表节点替换当前文本
            moduleViewInstead: 'instead of view htmls',//使用模块视图列表节点替换当前文本
            moduleCommentsInstead: 'instead of commnets',//使用模块注释列表节点替换当前文本
            moduleJsInstead: 'instead of js'//使用js脚本节点替换当前文本
        }),
        postpackager: fis.plugin('loader', {
            allInOne: false,
            useInlineMap: false,
            resourceType: 'mod'
        })
    })
    .match('*', {
        deploy: fis.plugin('local-deliver', {
            to: '../pc-dev'
        })
    });
