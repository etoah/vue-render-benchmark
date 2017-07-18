const SSR = require('vue-server-renderer').createRenderer();
const Vue = require('vue');
const Engine= require('@tencent/aga-vue-render')
const Aga = new Engine()



var infoTpl = `
    <ul class="list gift">
        <li class="item" 
            v-for="(item, index) in data.curList.items" 
            :class="{'vip-item': item.type === 15, 'valentine-gift': item.type === 16}" >
            <span class="gift-name">{{item.name}}</span> 
        </li>
    </ul>
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

//console.log(Aga.serialize())

var autonodeRender = require('./autonode')

benchmark({
    'Aga-vue-render': function(){
        htmlStr = Aga.render('testComp', {data: data})
        //console.log('===== Aga-vue-render',htmlStr)
    },
    'comps-autonode': function(){
        htmlStr = autonodeRender(data)
        //console.log('===== autonodeRender',htmlStr)
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

}, 1e5) 
