var todoApp = angular.module('todoApp', ['ngCookies', 'ui.toggle', 'googleplus']);


todoApp.config(['GooglePlusProvider', function(GooglePlusProvider) {
    GooglePlusProvider.init({
        clientId: '320140071039-ca70vs44594k8vlhc0ll8pko5gcr1ojs.apps.googleusercontent.com',
        apiKey: 'Vh308rxpoliebqwuKK_s4teO',
        scopes: 'https://www.googleapis.com/auth/userinfo.email'
    });
}]);

todoApp.service('taskIdService', function () {

    var taskId = null;
    return {
        getTaskId: function() {
            var newtaskId = taskId;
            taskId = null;
            return newtaskId;
        },

        getUrlParameter: function (param, dummyPath) {

            var sPageURL = dummyPath || window.location.search.substring(1),
                sURLVariables = sPageURL.split(/[&||?]/),
                res;

            for (var i = 0; i < sURLVariables.length; i += 1) {
                var paramName = sURLVariables[i],
                    sParameterName = (paramName || '').split('=');

                if (sParameterName[0] === param) {
                    res = sParameterName[1];
                }
            }

            return res;

        },

        setTaskID: function (id) {
            taskId = id;
            console.log(taskId);
        }

    };

});


todoApp.controller('TodoListController', function TodoListController($rootScope, $scope, $http, $cookies, $location, $window, taskIdService, GooglePlus)
{







    if (($cookies.get("access_token"))==null)
    {
        $window.open('/login.html', "_self");
    }

    var max_d = new Date();
    max_d.setDate(max_d.getDate() + 1);
    console.log(max_d);
    //noinspection JSDuplicatedDeclaration
    var month = max_d.getMonth() + 1;
    max_d = max_d.getFullYear() + "-" + month + "-" + max_d.getDate();
    console.log(max_d);


    var min_d = new Date();
    min_d.setDate(min_d.getDate());
    console.log(min_d);
    //noinspection JSDuplicatedDeclaration
    var month = min_d.getMonth() + 1;
    min_d = min_d.getFullYear() + "-" + month + "-" + min_d.getDate();
    console.log(min_d);

    var req = {
        method: 'GET',
        url: "http://127.0.0.1:8000/api/v1/tasks/?max_due_date=" + max_d + "&" + "min_due_date=" + min_d + "&ordering=time",
        headers: {
            "Content-type": "application/json",
            "Authorization": "Token " + $cookies.get("access_token")
        }

    };

    $http(req).then(function (data) {
        console.log(data.data.data.tasks);
        //$cookies.put("access_token", data.data.token);
        $scope.tasks = data.data.data.tasks;
        $scope.today = true;
        $scope.active1 = "active";
        $scope.active2 = "";
        $scope.active3 = "";

    });


    $scope.getTasks = function (taskDay) {

        var max_d = new Date();
        var min_d = new Date();
        var ordering;
        min_d.setDate(min_d.getDate());
        console.log(min_d);
        //noinspection JSDuplicatedDeclaration
        var month = min_d.getMonth() + 1;
        min_d = min_d.getFullYear() + "-" + month + "-" + min_d.getDate();
        console.log(min_d);

        if(taskDay == "today")
        {
            max_d.setDate(max_d.getDate() + 1);
            console.log(max_d);
            //noinspection JSDuplicatedDeclaration
            var month = max_d.getMonth() + 1;
            max_d = max_d.getFullYear() + "-" + month + "-" + max_d.getDate();
            console.log(max_d);
            ordering = "time";
            $scope.today = true;
            $scope.active1 = "active";
            $scope.active2 = "";
            $scope.active3 = "";

        }
        else if(taskDay == "week")
        {
            max_d.setDate(max_d.getDate() + 7);
            console.log(max_d);
            //noinspection JSDuplicatedDeclaration
            var month = max_d.getMonth() + 1;
            max_d = max_d.getFullYear() + "-" + month + "-" + max_d.getDate();
            console.log(max_d);
            ordering = "due_date";
            $scope.today = false;
            $scope.active1 = "";
            $scope.active2 = "active";
            $scope.active3 = "";

        }
        else
        {
            max_d.setDate(max_d.getDate() + 100);
            console.log(max_d);
            //noinspection JSDuplicatedDeclaration
            var month = max_d.getMonth() + 1;
            max_d = max_d.getFullYear() + "-" + month + "-" + max_d.getDate();
            console.log(max_d);
            ordering = "last_updated";
            $scope.today = false;
            $scope.active1 = "";
            $scope.active2 = "";
            $scope.active3 = "active";
        }

        var req = {
            method: 'GET',
            url: "http://127.0.0.1:8000/api/v1/tasks/?max_due_date=" + max_d + "&" + "min_due_date=" + min_d + "&ordering="+ordering,
            headers: {
                "Content-type": "application/json",
                "Authorization": "Token " + $cookies.get("access_token")
            }

        };

        $http(req).then(function (data) {
            console.log(data.data.data.tasks);
            //$cookies.put("access_token", data.data.token);
            $scope.tasks = data.data.data.tasks;

        }, function (data) {



        });



    };

    $scope.updateTask = function(id)
    {
        window.open("/update_todo.html?id=" + id);
    };

    $scope.deleteTask = function (event, tasks, index, id) {

        event.stopPropagation();



        //Todo call server and then remove;

        console.log(tasks[index].id + " == " + id);


        var req = {
            method: 'DELETE',
            url: "http://127.0.0.1:8000/api/v1/tasks/" + id,
            headers: {
                "Content-type": "application/json",
                "Authorization": "Token " + $cookies.get("access_token")
            }

        };

        $http(req).then(function (data) {

            //$cookies.put("access_token", data.data.token);
            tasks.splice(index, 1);


        });



        //console.log(index);
    };

    $scope.checkCompleted = function (taskobj, id) {


        //console.log(task);
        console.log("id " + id);
        console.log(taskobj);

        var data;
        if(taskobj.is_completed == true)
        {
            data = {
                is_completed: false
            }
        }
        else
        {
            data = {
                is_completed: true
            }
        }

        var req = {
            method: 'PUT',
            url: "http://127.0.0.1:8000/api/v1/tasks/" + id,
            headers: {
                "Content-type": "application/json",
                "Authorization": "Token " + $cookies.get("access_token")
            },
            data: taskobj

        };

        $http(req).then(function (data) {

            //$cookies.put("access_token", data.data.token);
            console.log("yes");
            console.log(data);


        },
        function (data) {
            console.log(data);
        });
        
    };

    $scope.logout = function () {


        $cookies.remove("access_token");
        GooglePlus.logout()
        $window.open("/login.html", "_self");

    }

});

todoApp.controller('LoginController', function LoginController($rootScope, $scope, $http, $cookies, $location, $window, GooglePlus ) {

    /*if (($cookies.get("access_token"))!=null)
    {
        $window.open('/', "_self");
    }*/

    $scope.login = function () {

        if($scope.username == null || $scope.password == null)
        {
            $window.alert("please enter username and password");
        }

        //$scope.username = "newuser2";
        //$scope.password = "abhishek";
        $scope.data = { username: $scope.username, password: $scope.password};
        console.log($scope.username);
        console.log($scope.password);
        var req = {
            method: 'POST',
            url: "http://127.0.0.1:8000/api/v1/tokens/",
            headers: {
                "Content-type": "application/json"

            },
            //data: $httpParamSerializer($scope.data)
            data: $scope.data
        };

        $http(req).then(function (data) {
            console.log(data.data.token);
            if(data.data.token)
            {
                $cookies.put("access_token", data.data.token);
                $window.open('/', "_self");
            }
            else if(data.data.error)
            {
                $scope.error_google_user = "Previously logged in by google. Please register to login by password";
            }

        }, function (data) {

            console.log(data);
            //$window.alert("please verify account");

        });
        
    };

    $scope.googlelogin = function () {

        GooglePlus.login().then(function (authResult) {
            console.log(authResult);
            console.log(authResult.access_token);

            GooglePlus.getUser().then(function (user) {
                console.log("yes");
                console.log(user.email);
                console.log(user.given_name);
;                console.log(user);


                var req = {
                    method: 'POST',
                    url: "http://127.0.0.1:8000/api/v1/googleplus/",
                    headers: {
                        "Content-type": "application/json"

                    },
                    //data: $httpParamSerializer($scope.data)
                    data: {
                        email_id: user.email,
                        access_token: authResult.access_token,
                        given_name: user.given_name
                    }
                };

                $http(req).then(function (data) {
                    console.log(data.data.token);

                    if(data.data.token)
                    {
                        $cookies.put("access_token", data.data.token);
                        $window.open('/', "_self");

                    }
                    else if(data.data.error)
                    {
                        $cookies.put("username", user.email);
                        $cookies.put("first_name", "");
                        $window.open("/register.html", "_self");

                    }


                }, function (data) {

                    console.log(data);
                    //$window.alert("please verify account");

                });



                //$cookies.put("google_access_token",true);
            });



        }, function (err) {
            console.log(err);
        });
        
    }

});

todoApp.controller('RegisterController', function RegisterController($scope, $http, $cookies, $window) {
    

    
    $scope.register = function () {
        
        if($scope.password == null || $scope.username == null || $scope.firstname == null)
        {
            $window.alert("some fields are missing");
        }

        else
        {
            $scope.data = {

                first_name: $scope.firstname,
                last_name: $scope.lastname,
                is_active: false,
                username: $scope.username,
                password: $scope.password

            };

            var req = {
                method: 'POST',
                url: "http://127.0.0.1:8000/api/v1/users/",
                headers: {
                    "Content-type": "application/json"

                },
                //data: $httpParamSerializer($scope.data)
                data: $scope.data
            };

            $http(req).then(function (data) {
                console.log(data.data);
                $window.alert("verification email sent. Please verify and then login");
                $window.open('/login.html', "_self");

            }, function (data) {
                console.log(data);
                if(data.data.error)
                {
                    $scope.msg = "user already exists";
                }

            });
        }



    }

});

todoApp.controller('UpdateController', function UpdateController($scope, $http, taskIdService, $location, $cookies, $window) {


    if (($cookies.get("access_token"))==null)
    {
        $window.open('/login.html', "_self");
    }
    
    var taskId = taskIdService.getUrlParameter('id');


    if (taskId != null)
    {
        console.log(taskId);

        $scope.add_update = "Update ";

        var req = {
            method: 'GET',
            url: "http://127.0.0.1:8000/api/v1/tasks/" + taskId,
            headers: {
                "Content-type": "application/json",
                "Authorization": "Token " + $cookies.get("access_token")

            }
            //data: $httpParamSerializer($scope.data)
            //data: $scope.data
        };

        $http(req).then(function (data) {
            console.log(data.data);
            var task = data.data.data.task;

            $scope.description = task.description;

            if(task.due_date == null)
            {
                $scope.checked1 = false;
                $scope.checked2 = false;
            }
            else
            {

                $scope.checked1 = true;
                var due_date = new Date(task.due_date);
                console.log("due_date " + due_date);
                $scope.date = due_date;
            }

            if(task.time == null)
            {
                $scope.checked2 = false;

            }
            else
            {
                $scope.checked2 = true;
                console.log(task.time);
                var hrs = task.time.substring(0,2);
                var mins = task.time.substring(3,5);

                console.log(hrs);
                console.log("Mins " + mins);
                var time  = new Date();
                time.setHours(hrs, mins);
                $scope.time = time;
            }

        });


    }
    else
    {
        $scope.add_update = "Add new ";
        console.log("new task")
    }

    $scope.checkedStatus = function()
    {
        $scope.checked2 = $scope.checked1 * $scope.checked2;
    };


    $scope.submit = function () {



        //Todo: validate first

        //console.log($scope.time.getHours() + ":" + $scope.time.getMinutes());
        console.log($scope.date);
        var newDate = $scope.date;
        var newTime = null;
        /*
        if(newDate == null)
        {
            $scope.due_date_bool = true;
            $scope.due_date_error = "Please enter a valid date"
        }
        */

        //console.log($scope.time);
        if(newDate!=null && $scope.time != null)
        {
            newDate.setHours($scope.time.getHours(), $scope.time.getMinutes());
            newTime = $scope.time.getHours() + ":" + $scope.time.getMinutes();

            console.log("yes");
            console.log(newDate);
            console.log(newTime);
        }

        if(newDate != null && $scope.time == null)
        {
            newDate.setHours(0, 1);
        }




        $scope.data = {
            description: $scope.description,
            due_date: newDate,
            time: newTime,
            is_completed: false,
            is_active: true,
            last_updated: new Date()
        };

        var method, url;

        if(taskId != null)
        {
            //update

            method = 'PUT';
            url = "http://127.0.0.1:8000/api/v1/tasks/" + taskId;


        }

        else
        {
            method = 'POST';
            url = "http://127.0.0.1:8000/api/v1/tasks/";
        }

        var req = {
            method: method,
            url: url,
            headers: {
                "Content-type": "application/json",
                "Authorization": "Token " + $cookies.get("access_token")

            },
            //data: $httpParamSerializer($scope.data)
            data: $scope.data
        };

        $http(req).then(function (data) {

            console.log(data);
            $window.open('/',"_self");

        },
        function (data) {

            console.log(data);

        });

    };

    $scope.cancel = function () {

        $window.open('/',"_self");

    }



});


todoApp.controller('VerifyAccountController', function UpdateController($scope, $http, taskIdService, $location, $cookies, $window) {

    var userId = taskIdService.getUrlParameter('id');
    var username = taskIdService.getUrlParameter('user');
    var token = taskIdService.getUrlParameter('token') + "=";
    token = encodeURIComponent(token);
    console.log(userId);
    console.log(username);
    console.log(token);

    var req = {
        method: 'GET',
        url: "http://127.0.0.1:8000/api/v1/tokens/?id=" + userId + "&user=" + username + "&token=" + token,
        headers: {
            "Content-type": "application/json"

        }
        //data: $httpParamSerializer($scope.data)
        //data: $scope.data
    };

    $http(req).then(function (data) {
        console.log(data.data);
        $scope.verify = "user verified successfully";
        //$window.alert("user verified successfully");
        $window.open('/login.html', "_self");

    }, function (data) {

        console.log(data);

    });



});
