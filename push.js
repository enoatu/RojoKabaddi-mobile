'use strict';

const push = require('web-push');

const GCM_API_KEY = 'AIzaSyD9GdXuzB0l49CIIylkfLWa3Daqv1p2D8k';
push.setGCMAPIKey(GCM_API_KEY);

const data = {
        'endpoint': 'https://android.googleapis.com/gcm/send/fWG_D4wEboE:APA91bHbsgvsIt4qX0_jRzDQa1TWrPpEWTYAo4uqLIJtUmA2JFZqjM6oJkq1xFfwlAlllHpTxZSpSEHj1m8fs9SkmX47QmRVKHYmYNZohdXHRZe03Ws5YArCASDGnnphks35CRsYygNy',
        'userAuth': 'KuEpXDFqY8Sz7aVY0adR8Q==',
        'userPublicKey': 'BHddmDCCFTXxUHWaAg1NSNCpX67g0zbfNCWLqLCj/bR5n7ugtXb7RnK3O1WEOtLUlhJero3tIE3Zy8gwIKiAlLs='
};

const pushSubscription = {
        endpoint: data.endpoint,
        keys: {
                    auth: data.userAuth,
                    p256dh: data.userPublicKey
                }
}

push.sendNotification(pushSubscription,'Hi! How are you?')
    .then(function(result) {
            console.log("success!");
                console.log(result);
            })
    .catch(function(err) {
            console.log("fail!");    
                console.error(err);
            });
