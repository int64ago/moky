<@compress>
<!DOCTYPE html>
<html>
<head>

    <#include "/common/macro.ftl">

    <title>首页</title>
    <meta charset="utf-8"/>
    <meta name="description" content="页面描述"/>
    <meta name="keywords" content="页面描述"/>

    <@css/>
    <link href="${csRoot}page/index.css" rel="stylesheet" type="text/css"/>
</head>
<body>
<@leftMenu menuObj=menuList curMenuId=requestUrl />
<!-- Page Content Here -->
<div class="g-bd">
    <div class="g-bdc">
        <div class="u-message u-message-info">welcome</div>
    </div>
</div>

<script src="${nejRoot}"></script>
<script>
    NEJ.define([
        'pro/page/index'
    ], function (m) {
        m._$$Module._$allocate();
    });
</script>
</body>
</html>
</@compress>