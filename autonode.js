const comps = require('comps')
const compsAutonodeAddons = require('comps-autonode-addons')
compsAutonodeAddons(comps)



var infoCompsTpl = `
    <ul class="list gift">
        {% foreach $arr="data.curList.items" $as="item" $index="index"%} 
            <li class="item"
            class="\${item.type === 15?'vip-item':''} \${item.type === 16?'valentine-gift':''}" >
            <span class="gift-name">\${item.name}</span> 
            </li>
        {% /foreach %}   
    </ul>
`

comps.componentLoader(function(name){
    var map = {
        'info': infoCompsTpl
    }
    return {
        request: name,
        content: map[name]
    }
})



var compsTplStr = `
<div>
    <nav class="ui-nav j-tabs">
        {% foreach $arr="data.tabList" $as="tab" $index="index"%} 
            <button class="item-nav \${data.curTab === tab.id ? 'current': ''}">
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



var tpl = comps({ template: compsTplStr })
var render = new Function('data', 'return \`' + tpl + '\`')

//console.log(render.toString())

module.exports = render
