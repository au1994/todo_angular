/**
 * Created by abhishekupadhyay on 03/07/16.
 */
'use strict';

console.log('Started', self);

self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
    console.log('Activated', event);
});

self.addEventListener('push', function(event) {
    console.log('Push message', event);


    var title = "Pending Tasks";
    var url = "http://127.0.0.1:8000/api/v1/notifications/";

    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Token bcb3d91aba1aff7e88cc2ce13bfdfe75ef906826");
    var req = {
        method: 'GET',
        headers: headers
    };

    event.waitUntil(

        fetch(url, req).then(function(response) {

            if (response.status !== 200) {

                console.log('Looks like there was a problem. Status Code: ' + response.status);
                throw new Error();
            }


            // Examine the text in the response
            return response.json().then(function(data) {


                console.log(data.length);

                return  self.registration.showNotification(title, {
                    'body': 'You have some pending tasks in 1 hour',
                    'icon': 'images/todo-icon.png'
                })
            });


        }));



});


self.addEventListener('notificationclick', function(event) {
    console.log('Notification click: tag', event.notification.tag);
    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    event.notification.close();
    var url = 'http://localhost:8000/';
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function(windowClients) {
                console.log('WindowClients', windowClients);
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    console.log('WindowClient', client);
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});
