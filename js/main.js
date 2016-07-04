

function myfunction(){

    console.log("in main.js");

    var reg;
    var sub;
    var isSubscribed = false;
//var subscribeButton = document.querySelector('button');
    var subscribeButton = document.getElementById("subscribe");
    console.log(subscribeButton);

    if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported');
        navigator.serviceWorker.register('sw.js').then(function() {
            console.log("yes added sw.js");
            return navigator.serviceWorker.ready;
        }).then(function(serviceWorkerRegistration) {
            reg = serviceWorkerRegistration;
            subscribeButton.disabled = false;
            console.log('Service Worker is ready :^)', reg);
        }).catch(function(error) {
            console.log('Service Worker Error :^(', error);
        });
    }

    console.log("here " + subscribeButton);
    subscribeButton.addEventListener('click', function() {
        if (isSubscribed) {
            unsubscribe();
        } else {
            subscribe();
        }
    });

    function subscribe() {
        reg.pushManager.subscribe({userVisibleOnly: true}).
        then(function(pushSubscription) {
            sub = pushSubscription;
            console.log('Subscribed! Endpoint:', sub.endpoint);
            res = sub.endpoint.split("/");
            var regId = res[res.length - 1];
            console.log(regId);
            var token = getCookie("access_token");
            console.log(token);
            token = "Token " + token;

            /*
            var req = {
                "async": true,
                "url": "http://127.0.0.1:8000/api/v1/gcmdevice/",
                "method": "POST",
                "headers": {
                    "Authorization": "Token bcb3d91aba1aff7e88cc2ce13bfdfe75ef906826",
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": {
                    "registration_id": regId,
                    "name": "chrome6",
                    "active": true
                }

            }

             $.ajax(req).done(function (response) {
             console.log("in ajax");
             console.log(response);
             });*/
            //var payload = {registration_id:regId, name:"device"};


            /*
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://127.0.0.1:8000/api/v1/gcmdevice/",
                "method": "POST",
                "headers": {
                    "authorization": "Token bcb3d91aba1aff7e88cc2ce13bfdfe75ef906826",
                    "content-type": "application/json"

                },
                "processData": false,
                "data": '{"registration_id": ,"name": "chr4"}'
            }

            $.ajax(settings).done(function (response) {
                console.log(response);
            });
            */
            //makeRequest("http://127.0.0.1:8000/api/v1/gcmdevice/", payload, token);

            /*
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://127.0.0.1:8000/api/v1/gcmdevice/",
                "method": "POST",
                "headers": {
                    "authorization": token,
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                    "postman-token": "7d13aeb4-2019-ad02-1f84-fbe174a05d7a"
                },
                "processData": false,
                "data": "{\n    \n    \n    \"registration_id\": \"fz-qebiDFAQ:APA91bFWncqWC_YDhT8JJRSmQCdXIX7KpuAqrW57yA3TJM8riwxrdPh2LGS_2yhvj0sqWCRqf6ihx_gqC1HmgQoueOF58LSnLDaIlFKVDa8Ik40yv0I9_Eq1VZhLHdXFq9gm9jENPz4o\",\n    \"name\": \"chrome4\"\n}"
            }

            $.ajax(settings).done(function (response) {
                console.log(response);
            });
            */

            



            subscribeButton.textContent = 'Unsubscribe';
            isSubscribed = true;
        });
    }

    function unsubscribe() {
        sub.unsubscribe().then(function(event) {
            subscribeButton.textContent = 'Subscribe';
            console.log('Unsubscribed!', event);
            isSubscribed = false;
        }).catch(function(error) {
            console.log('Error unsubscribing', error);
            subscribeButton.textContent = 'Subscribe';
        });
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }

    function makeRequest(url, payload,token) {
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('POST', url);
        httpRequest.setRequestHeader('Authorization', token);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(String(payload));
    }

    function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                console.log(httpRequest.responseText);
            } else {
                console.log('There was a problem with the request.');
            }
        }
    }

}


