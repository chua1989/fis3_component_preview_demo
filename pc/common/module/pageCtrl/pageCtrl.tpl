<%if(page > 1){%>
    <%
        var index = (typeof idx) !== 'undefined' ? idx : 1;
        var isFirst = (index==1)?true:false;
        var isLast = (index==page)?true:false;
        var from = parseInt(index-max/2);
        var to = parseInt(index+max/2);
        if(from == 2 || to == page-2){
            max = max+2;
        }
        var pager_id = "pager_id_" + Math.random().toString().replace(/\D/g, "");
    %>
    <div class="page-box">
        <span class="page-recored">第<%=index%>页/共<%=page%>页（共<%=total%>条记录）</span>
    <%if(page-2 <= max){%>
        <a href="javascript:void(0);" class="page-prev-btn <%if(isFirst){%>page-btn-dis<%}%>"><i class=""></i></a>
        <% for(var i=1,len=page;i<=len;i++){ %>
            <a href="javascript:void(0);" data-index="<%=i%>" class="page-btn<%if(i == 1){ %> page-first<%}%><%if(i == len){ %> page-last<%}%><%if(i == index){ %> page-btn-cur<%}%>"><%=i%></a>
        <%}%>
        <a href="javascript:void(0);" class="page-next-btn <%if(isLast){%>page-btn-dis<%}%>"><i class=""></i></a>
    <%}else{%>
        <%if((from > 2) && (to < page-2)){%>
            <a href="javascript:void(0);" class="page-prev-btn <%if(isFirst){%>page-btn-dis<%}%>"><i class=""></i></a>
            <a href="javascript:void(0);" data-index="1" class="page-btn page-first">1</a>
            <a href="javascript:void(0);" data-index="2" class="page-btn">2</a>
            <span>…</span>
            <% for(var i=from,len=page;i<to;i++){ %>
                <a href="javascript:void(0);" data-index="<%=i+1%>" class="page-btn<%if(i+1 == index){ %> page-btn-cur<%}%>"><%=i+1%></a>
            <%}%>
            <span>…</span>
            <a href="javascript:void(0);" data-index="<%=len-1%>" class="page-btn"><%=len-1%></a>
            <a href="javascript:void(0);" data-index="<%=len%>" class="page-btn page-last"><%=len%></a>
            <a href="javascript:void(0);" class="page-next-btn"><i class=""></i></a>
        <%}else{%>
            <%if(from <= 2){%>
                <a href="javascript:void(0);" class="page-prev-btn <%if(isFirst){%>page-btn-dis<%}%>"><i class=""></i></a>
                <% for(var i=1,len=page;i<=Math.max(max, to);i++){ %>
                    <a href="javascript:void(0);" data-index="<%=i%>" class="page-btn<%if(i == 1){ %> page-first<%}%><%if(i == len){ %> page-last<%}%><%if(i == index){ %> page-btn-cur<%}%>"><%=i%></a>
                <%}%>
                <span>…</span>
                <a href="javascript:void(0);" data-index="<%=len-1%>" class="page-btn"><%=len-1%></a>
                <a href="javascript:void(0);" data-index="<%=len%>" class="page-btn page-last"><%=len%></a>
                <a href="javascript:void(0);" class="page-next-btn"><i class=""></i></a>
            <%}%>

            <%if(to >= page-2){%>
                <a href="javascript:void(0);" class="page-prev-btn <%if(isFirst){%>page-btn-dis<%}%>"><i class="icon-font i-v-left"></i></a>
                <a href="javascript:void(0);" data-index="1" class="page-btn page-first">1</a>
                <a href="javascript:void(0);" data-index="2" class="page-btn">2</a>
                <span>…</span>
                <% for(var i=Math.min(from , page-max),len=page;i<page;i++){ %>
                    <a href="javascript:void(0);" data-index="<%=i+1%>" class="page-btn<%if(i == index-1){ %> page-btn-cur<%}%><%if(i == page-1){ %> page-last<%}%>"><%=i+1%></a>
                <%}%>
                <a href="javascript:void(0);" class="page-next-btn <%if(isLast){%>page-btn-dis<%}%>"><i class="icon-font i-v-right"></i></a>
            <%}%>
        <%}%>
    <%}%>
    </div>
<%}%>
