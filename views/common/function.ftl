<#-- JSON stringify -->
<#if !user??>
<#function stringify obj>
    <#if !obj??>
        <#return 'undefined'>
    </#if>
    <#if obj?is_date>
        <#return '"' + obj?string("yyyy-MM-dd HH:mm:ss") + '"'>
    </#if>
    <#if obj?is_boolean || obj?is_number>
        <#return obj?string>
    </#if>
    <#if obj?is_enumerable>
        <#local str = '['>
        <#list obj as x>
            <#local str = str + stringify(x)>
            <#if x_has_next>
                <#local str = str + ','>
            </#if>
        </#list>
        <#return str + ']'>
    </#if>
    <#if obj?is_string>
        <#return '"' + obj?js_string + '"'>
    </#if>
    <#if obj?is_hash || obj?is_hash_ex>
        <#local str = '{'>
        <#local arr = [] >
        <#local keys = obj?keys>
        <#list keys as x>
            <#if x!='class' && obj[x]??>
                <#local arr = arr + [x]>
            </#if>
        </#list>
        <#list arr as x>
            <#local str = str + x + ':' + stringify(obj[x])>
            <#if x_has_next>
                <#local str = str + ','>
            </#if>
        </#list>
        <#return str + '}'>
    </#if>
    <#return ''>
    <#if obj?is_string>
        <#return '"' + obj?js_string + '"'>
    </#if>
</#function>
<#else>
    <#function stringify obj>
        <#if !obj??>
            <#return 'undefined'>
        </#if>
        <#if obj?is_enumerable>
            <#local str = '['>
            <#list obj as x>
                <#local str = str + stringify(x)>
                <#if x_has_next>
                    <#local str = str + ','>
                </#if>
            </#list>
            <#return str + ']'>
        </#if>
        <#if obj?is_hash || obj?is_hash_ex>
            <#local str = '{'>
            <#local arr = []>
            <#local keys = obj?keys>
            <#list keys as x>
                <#if x!='class' && obj[x]?? && !obj[x]?is_method>
                    <#local arr = arr + [x]>
                </#if>
            </#list>
            <#list arr as x>
                <#local str = str + x + ':' + stringify(obj[x])>
                <#if x_has_next>
                    <#local str = str + ','>
                </#if>
            </#list>
            <#return str + '}'>
        </#if>
        <#if obj?is_date>
            <#return '"' + obj?string("yyyy-MM-dd HH:mm:ss") + '"'>
        </#if>
        <#if obj?is_boolean || obj?is_number>
            <#return obj?string>
        </#if>
        <#if obj?is_string>
            <#return '"' + obj?js_string + '"'>
        </#if>
        <#return ''>
    </#function>
</#if>