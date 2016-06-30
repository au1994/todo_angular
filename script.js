var todoApp = angular.module('todoApp', ['ngCookies', 'ui.toggle']);


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


todoApp.controller('TodoListController', function TodoListController($rootScope, $scope, $http, $cookies, $location, $window, taskIdService)
{
    if (($cookies.get("access_token"))==null)
    {
        $window.open('/login.html', "_self");
    }



    var req = {
        method: 'GET',
        url: "http://127.0.0.1:8000/api/v1/tasks/",
        headers: {
            "Content-type": "application/json",
            "Authorization": "Token " + $cookies.get("access_token")
        }

    };

    $http(req).then(function (data) {
        console.log(data.data.data.tasks);
        //$cookies.put("access_token", data.data.token);
        $scope.tasks = data.data.data.tasks;

    });



	$scope.phones = [
    {
      name: 'Nexus S',
      snippet: 'Fast just got faster with Nexus S.'
    }, {
      name: 'Motorola XOOM™ with Wi-Fi',
      snippet: 'The Next, Next Generation tablet.'
    }, {
      name: 'MOTOROLA XOOM™',
      snippet: 'The Next, Next Generation tablet.'
    }
  ];

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
        
    }

});

todoApp.controller('LoginController', function LoginController($rootScope, $scope, $http, $cookies, $location, $window) {

    /*if (($cookies.get("access_token"))!=null)
    {
        $window.open('/', "_self");
    }*/

    $scope.username = "newuser2";
    $scope.password = "abhishek";
    $scope.data = { username: $scope.username, password: $scope.password};
    var req = {
        method: 'POST',
        url: "http://127.0.0.1:8000/api/v1/api-token-auth/",
        headers: {
            "Content-type": "application/json"

        },
        //data: $httpParamSerializer($scope.data)
        data: $scope.data
    };

    $http(req).then(function (data) {
        console.log(data.data.token);
        $cookies.put("access_token", data.data.token);
        $window.open('/', "_self");
        
    });

});

todoApp.controller('RegisterController', function RegisterController($scope) {

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
                time.setHours(13, mins);
                $scope.time = time;
            }

        });


    }
    else
    {
        console.log("new task")
    }

    $scope.checkedStatus = function()
    {
        $scope.checked2 = $scope.checked1 * $scope.checked2;
    };


    $scope.submit = function () {



        //Todo: validate first

        console.log($scope.time.getHours() + ":" + $scope.time.getMinutes());



        $scope.data = {
            description: $scope.description,
            due_date: $scope.date,
            time: $scope.time.getHours() + ":" + $scope.time.getMinutes(),
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

        },
        function (data) {

            console.log(data);

        });

    };

    $scope.cancel = function () {

        $window.open('/',"_self");

    }



});
