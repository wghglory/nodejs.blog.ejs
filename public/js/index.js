'use strict';

{
    let $loginBox = $('#loginBox');
    let $registerBox = $('#registerBox');
    let $userInfo = $('#userInfo');

    //切换到注册面板
    $loginBox.find('a.colMint').on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登录面板
    $registerBox.find('a.colMint').on('click', function() {
        $loginBox.show();
        $registerBox.hide();
    });

    //注册
    $registerBox.find('button').on('click', function() {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/signup',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $registerBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //注册成功
                    setTimeout(() => {
                        $loginBox.show();
                        $registerBox.hide();
                    }, 1000);
                }

            }
        });
    });

    //登录
    $loginBox.find('button').on('click', function() {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/signin',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $loginBox.find('.colWarning').html(result.message);
                if (!result.code) {
                    //登录成功
                    /*setTimeout(() => {
                        $loginBox.hide();
                        $userInfo.show();

                        //show user info
                        $userInfo.find('.username').html(result.userInfo.username);
                        $userInfo.find('.info').html('hi, welcome!');
                    }, 1000);*/

                    //after login => cookie has userInfo => reload page => index.html will render based on "userInfo"
                    window.location.reload();
                }
            }
        });
    });

    //退出
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/user/signout',
            success: function(result) {
                if (!result.code) {
                    // backend clear cookie, req.userInfo = null => reload will show login
                    window.location.reload();
                }
            }
        });
    });

}
