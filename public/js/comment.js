'use strict';

{
    // dateFormat comes from time.js
    /*  not use pagination.js
        let pageSize = 3;
        let page = 1;
        let maxPageNumber = 0;*/
    let comments = [];

    // use pagination.js
    function loadData(pageIndex, pageSize) { //click first page, pageIndex = 1, not 0 based
        $('.messageList').empty();

        pageSize = pageSize || 3;
        let startIndex = (pageIndex - 1) * pageSize; //starting data
        let endIndex = startIndex + pageSize; //ending data
        endIndex = endIndex > comments.length ? comments.length : endIndex;

        if (comments.length === 0) {
            $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
        } else {
            let commentHtml = '';
            for (let i = startIndex; i < endIndex; i++) {
                commentHtml += `<div class="messageBox">
                        <p class="name clear">
                            <span class="fl">${comments[i].username}</span>
                            <span class="fr">${dateFormat(new Date(), 'YYYY年MM月DD日 hh:mm:ss')}</span>
                        </p>
                        <p>${comments[i].content}</p>
                     </div>`;
            }
            $('.messageList').html(commentHtml);
        }
    }


    //提交评论
    $('#messageBtn').on('click', function() {
        $.ajax({
            type: 'POST',
            url: '/api/comment',
            data: {
                articleid: $('#articleId').val(),
                content: $('#messageContent').val()
            },
            success: function(responseData) {
                $('#messageContent').val('');
                comments = responseData.article.comments.reverse();
                renderComment();
            }
        });
    });

    //每次页面重载的时候获取一下该文章的所有评论
    $.ajax({
        url: '/api/comment',
        data: {
            articleid: $('#articleId').val()
        },
        success: function(responseData) {
            comments = responseData.comments.reverse();
            renderComment();
        }
    });

    // $('.pager').delegate('a', 'click', function() {
    //     if ($(this).parent().hasClass('previous')) {
    //         page--;
    //     } else {
    //         page++;
    //     }
    //     renderComment();
    // });

    function renderComment() {
        $('#messageCount').html(comments.length);

        // use pagination.js
        pagination({
            id: 'pagination',
            pageIndex: 1, // 当前要显示页面，1开始
            pageSize: 3, // 每页显示条数
            totalCount: comments.length, // 总数据个数， 总页码pageCount = Math.ceil(totalCount/pageSize)
            callBack: function(currentPageIndex, pageSize, totalPageCount) { //分页标签加载完毕后执行
                // alert('当前页:' + currentPageIndex + ',总共页:' + totalPageCount);
                loadData(currentPageIndex, pageSize);
            },
            aClick: function(targetA) { //点击某个a执行
                targetA.style.opacity = 0.1;
            },
            delayTime: 500 //点击某个a后延迟500ms，再重新call page()
        });

        /*not use pagination.js
        maxPageNumber = Math.max(Math.ceil(comments.length / pageSize), 1);
        let start = Math.max(0, (page - 1) * pageSize);
        let end = Math.min(start + pageSize, comments.length);

        let $lis = $('.pager li');
        $lis.eq(1).html(page + ' / ' + maxPageNumber);

        if (page <= 1) {
            page = 1;
            $lis.eq(0).html('<span>没有上一页了</span>');
        } else {
            $lis.eq(0).html('<a href="javascript:;">上一页</a>');
        }
        if (page >= maxPageNumber) {
            page = maxPageNumber;
            $lis.eq(2).html('<span>没有下一页了</span>');
        } else {
            $lis.eq(2).html('<a href="javascript:;">下一页</a>');
        }

        // load data
        if (comments.length == 0) {
            $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
        } else {
            let html = '';
            for (let i = start; i < end; i++) {
                html += `<div class="messageBox">
                        <p class="name clear">
                            <span class="fl">${comments[i].username}</span>
                            <span class="fr">${dateFormat(new Date(), 'YYYY年MM月DD日 hh:mm:ss')}</span>
                        </p>
                        <p>${comments[i].content}</p>
                     </div>`;
            }
            $('.messageList').html(html);
        }*/

    }

}
