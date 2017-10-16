/*
 * 根据moky.urlMaps.js中的路由信息生成单页的路由, 输出文件到javascript/router目录下
 */
const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
const camelcase = require('camelcase')
const routes = require('../moky.urlMaps')

/* template */
const template = `
/* 路由文件由build/router.js中生成，请勿手动修改 */
import restate from 'regular-state';
import Layout from 'common/layout';

const routes = {
    app: {
        url: '',
        view: Layout
    },
    {{#each modules}}
    '{{state}}': {
        url: '{{url}}',
        view: (option, resolve) => {
            require.ensure([], () => {
                resolve(require('page/{{path}}').default);
            });
        }
    }{{#unless @last}},{{/unless}}
    {{/each}}
};

export default restate({ routes });
`

const modules = [];
for (let k in routes) {
    const state = k.replace('/', '');
    modules.push({
        url: k,
        path: routes[k],
        view: camelcase(state),
        state: `app.${state}`
    });
}

const result = Handlebars.compile(template)({ modules });
fs.writeFileSync(path.resolve(__dirname, '../src/javascript/router/index.js'), result);