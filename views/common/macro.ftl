<#include "./config.ftl">
<#include "./function.ftl">

<#macro css>
  <link href="${csRoot}animate.css" rel="stylesheet" type="text/css"/>
  <link href="${csRoot}reset.css" rel="stylesheet" type="text/css"/>
  <link href="${csRoot}icon.css" rel="stylesheet" type="text/css"/>
  <link href="${csRoot}project.css" rel="stylesheet" type="text/css"/>
  <link href="${csRoot}base.css" rel="stylesheet" type="text/css"/>
</#macro>

<#function containsId list url>
    <#local flag = false />
    <#list list as item>
        <#if item.url == url>
            <#local flag = true />
        </#if>
    </#list>
    <#return flag>
</#function>

<#function isHomePage url>
    <#local flag = false />
    <#if url == "/index">
        <#local flag = true />
    </#if>
    <#return flag>
</#function>

<#-- 左侧菜单 -->
<#macro leftMenu menuObj=[] curMenuId=''>
<div class="g-sd" id="J-sidebar">
    <div class="head">
        <a href="/" class="logo"></a>
        <h1>仓库物流系统</h1>
        ${(user.username)!''}
        <ul class="f-mt10 f-mb10">
            <li class="tag">中文</li>
        </ul>
        <a class="s-fc-white" href="/backend/logout">退出</a>
    </div>
    <#-- 输出一级菜单 -->
    <#list menuObj as menu>
        <div class="<#if containsId(menu.childsList![], curMenuId) || (menu_index == 0 && isHomePage(curMenuId))>active</#if>">
            <h3 class="nav-header">${menu.name}</h3>
            <ul class="nav-pills">
            <#-- 输出二级菜单 -->
                <#local subMenuList=menu.childsList/>
                <#list subMenuList as subMenu>
                    <li>
                        <a href="${subMenu.url}" class="link <#if curMenuId==subMenu.url>selected</#if>">${subMenu.name}</a>
                    </li>
                </#list>
            </ul>
        </div>
    </#list>
</div>
</#macro>

<#-- 内容模板 Added by Cody <hzchengzhangjun@> -->
<#macro contentTpl title='标题' id='app'>
<div class="g-bd">
  <div class="g-bdc2">
      <div class="m-header">${title}</div>
      <div id="${id}"></div>
  </div>
</div>
</#macro>
