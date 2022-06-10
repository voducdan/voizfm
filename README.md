## Server ssh (```.pem``` file will be sent in email)
* staging: ```ssh -i stg-website-voizfm.pem ubuntu@18.140.115.200```
* prod: ```ssh -i voiz.vn-production.pem ubuntu@18.141.8.52```

## Local run
* Create .env file in root folder having below content
    ```
    NEXT_PUBLIC_BASE_URL=stg-api-nd.voiz.vn/v1
    NEXT_PUBLIC_API_PROTOCAL=https
    NEXT_PUBLIC_SHA256_SECRET_KEY=58c/BEG+qZyJU6fU5atuEkWWN2s=
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=442348353751-g6c2cqe659i4df6pfv1v2vs31g40ms7m.apps.googleusercontent.com
    NEXT_PUBLIC_GOOGLE_SECRET_ID=hBQ9JQw2hhhMec_p12WfKKgj
    NEXT_PUBLIC_FACEBOOK_APP_ID=2746448429009176
    NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCdlNAO-BtLKRfOmxAWc-vtyluME1TK9-w
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=wewe-jsc
    NEXT_PUBLIC_FIREBASE_APP_ID=1:1070814418454:web:4c4c478b34ec8a020dc737
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Y90JDBYKJM
    NEXT_PUBLIC_FIREBASE_MESSAGESENDER_ID=1070814418454
    NEXT_PUBLIC_FIREBASE_EMAIL=dan.vo@wewe.vn
    NEXT_PUBLIC_FIREBASE_PASSWORD=voizfm@123
    ```
* Install packages
    ```npm i```
* Start server
    * Run on dev mode
        ``` npm run dev```
    * Run on prod mode
        ``` npm run build```
        ``` npm start ```

# Staging & Prod run ( ```.env``` file is already on staging & prod server)
* Install packages
    ``` npm i```
* Start server
    ``` npm run build ```
    ``` npm start ```

> Staging & prod is running inside a tmux session, use ``` tmux ls``` to check if a tmux session exists before running to avoid conflict port


