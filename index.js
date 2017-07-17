const SSR = require('vue-server-renderer').createRenderer();
const Vue = require('vue');
const Engine= require('@tencent/aga-vue-render')
const Aga = new Engine()

const comps = require('comps')
const compsAutonodeAddons = require('comps-autonode-addons')
compsAutonodeAddons(comps)
comps.componentLoader(function(name, tpl){
    return {
        request: name,
        content: tpl
    }
})



var infoTpl = `
    <ul class="list gift">
        <li class="item" 
            v-for="(item, index) in data.curList.items" 
            :class="{'vip-item': item.type === 15, 'valentine-gift': item.type === 16}" >
            <span class="gift-name">{{item.name}}</span> 
        </li>
    </ul>
`
// var infoCompsTpl = `
//     <ul class="list gift">
//         {% foreach $arr="data.curList.items" $as="item" $index="index"%} 
//             <li class="item"
//             class="\${item.type === 15?'vip-item':''} \${item.type === 16?'valentine-gift':''}" >
//             <span class="gift-name">\${item.name}</span> 
//             </li>
//         {% /foreach %}   
//     </ul>
// `

// var tpl = comps({ template: infoCompsTpl })
// var infoRender = new Function('data', 'return \`' + tpl + '\`')
// console.log(infoRender.toString())



var compsTplStr = `
<div>
    <nav class="ui-nav j-tabs">
        {% foreach $arr="data.tabList" $as="tab" $index="index"%} 
            <button class="item-nav \${data.curTab === tab.id ? 'current': ''}" :class="{current: }">
            \${tab.name}
            </button>
        {% /foreach %} 
    </nav>
    {% component $id="info" with="{data: data}" /%}
    <div class="gift-list">
    <ul class="list gift">
        {% foreach $arr="data.curList.items" $as="item" $index="index"%} 
            <li class="item"
            class="\${item.type === 15?'vip-item':''} \${item.type === 16 ? 'valentine-gift' : ''}" >
            <span class="gift-name">\${item.name}</span> 
            </li>
        {% /foreach %}   
    </ul>
    </div>
</div>
`



var tplStr = `
<div>
    <nav class="ui-nav j-tabs">
        <button v-for="(tab, index) in data.tabList" class="item-nav" :class="{current: data.curTab === tab.id}">
        {{tab.name}}
        </button>
    </nav>
    <info :data='data'></info>
    <div class="gift-list">
        <ul class="list gift">
            <li class="item" 
                v-for="(item, index) in data.curList.items" 
                :class="{'vip-item': item.type === 15, 'valentine-gift': item.type === 16}" >
                <span class="gift-name">{{item.name}}</span> 
            </li>
        </ul>
    </div>
</div>
`

var data = {
    platform: 'aa',
    forbidden: true,
    tabList: [{id: 123, name: 'test'}, {id: 123, name: 'test'}, {id: 123, name: 'test'}, {id: 123, name: 'test'}],
    curList: {
        items: []
    }
};



var htmlStr = '';
for(var i = 0; i < 5; i++) data.curList.items.push({
    id: 1,
    type: 2,
    name: Math.random()
        .toString(36)
        .substring(2, 
            2+ Math.ceil(Math.random()*10)),
    isMusic: false,
    format: 'png'
});

Aga.component({
    name: 'info',
    template: infoTpl,
    props: ['data']
})

var info = Vue.component('info', {
    name: 'info',
    template: infoTpl,
    props: ['data']
})

Aga.component({
    name: 'testComp',
    template: tplStr,
    props: ['data']
})

var vueObj = new Vue({
    template: tplStr,
    data: {
        data: data
    },
    components: {
        info
    }
});

 

benchmark({
    'Aga-vue-render': function(){
        htmlStr = Aga.render('testComp', {data: data})
        //console.log('===== Aga-vue-render',htmlStr)
    },
    'vue-server-render': function(){
        SSR.renderToString(vueObj, function(error, bodyStr) {
        if (error) {
            console.log('模板渲染错误');
        } else {
            htmlStr = bodyStr;
            //console.log('----vue-server-render',htmlStr)
        }
    });
    }
}, 1e4)
