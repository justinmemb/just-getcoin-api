# GetConis Application

The idea is to develop a mobile cross-platform application that allows users to exchange FIAT for cryptocurrencies and viceversa using the nearby function like local bitcoins you can see the offers around you and pick your one.

* Users register to the app with SMS pin verification and then can immediately.
* Post BUY and SELL offers geolocalized (point suggested or forced) with also a small description and a timeframe (ex: I will be at LA  Airport tomorrow from 14:00 to 18:00)
* Explore the current nearby offers
* Checking in a different place to explore the offers there
* If is selling cryptocurrencies need to deposit it into our escrow wallet
* If is buy must post a photo with the FIAT + Timestamp to be eligible to contact the seller
* chats are end-to-end encrypted

## API's

## Programing Language & Database 

* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)

## Framework & Dependencies 

* body-parser 
* express
* geojson
* geospatial
* mongoose
* mongoose-double
* multer
* nodemailer
* validator

## Acknowledgments

* We use [HEROKU](https://dashboard.heroku.com) free hosting for test your api's
BASEURL: https://getcoins.herokuapp.com

* Use [postman](https://www.getpostman.com/) for check apis 

## Users Action

### Request URL for Registeration

```
* URL: BASEURL/users/register/
* HTTP Methods: POST
* PARAMETERS:  name:John Doe
               image:http://parihargroup.scienceontheweb.net/rohit-parihar.jpg
               email:john.doe@mailinator.com
               mobile:4155552671
               password:Test@123
               location:Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France
               latitude:48.8583701
               longitude:2.2922926
```

### Request URL for Login

With Mobile
```
* URL: BASEURL/users/mobile/login
* HTTP Methods: GET
* PARAMETERS:  mobile:4155552671
```

With Email & Password
```
* URL: BASEURL/users/login/email
* HTTP Methods: GET
* PARAMETERS:  email:john.doe@mailinator.com
               password:Test@123
```

### Request URL for Verify Pin
```
* URL: BASEURL/users/verify/pin/
* HTTP Methods: POST
* PARAMETERS:  source:4155552671
               pin:[pin generated login with mobile number]
```

### Request URL for Forgot Password

With Mobile
```
* URL: BASEURL/users/password/forgot
* HTTP Methods: POST
* PARAMETERS: source:4155552671
```

With Email & Password
```
* URL: BASEURL/users/password/forgot
* HTTP Methods: POST
* PARAMETERS:  source:john.doe@mailinator.com
```

### Request URL for Change Password

With Email
```
* URL: BASEURL/users/password/change
* HTTP Methods: POST
* PARAMETERS:  source:john.doe@mailinator.com
               old_password:Test@123
               new_password:Test@125
```

### Request URL for Update Password

With User
```
* URL: BASEURL/users/update/password/
* HTTP Methods: POST
* PARAMETERS:  user_id:[return in response of login api]
               old_password:Test@123
               new_password:Test@125
```

### Request URL for Users within a specific distance 

```
* URL: BASEURL/users/list
* HTTP Methods: GET
* PARAMETERS:  latitude:48.8583701
               longitude:2.2922926
               distance:5
```

### Request URL for Profile 

```
* URL: BASEURL/users/profile
* HTTP Methods: GET
* PARAMETERS:  user_id:[return in response of login api]
```

### Request URL for Update Language

```
* URL: BASEURL/users/update/language/
* HTTP Methods: POST
* PARAMETERS:  user_id:[return in response of login api]
               language:Malayalam
               language_code:mal
```

### Request URL for Update Location

```
* URL: BASEURL/users/update/location/
* HTTP Methods: POST
* PARAMETERS:  user_id:[return in response of login api]
               location:10 Rue du Général Camou, 75007 Paris, France
               latitude:48.8583701
               longitude:2.2922926
```

## Feedback Action

### Request URL for Feedback 

```
* URL: BASEURL/feedbacks/create/
* HTTP Methods: POST
* PARAMETERS:  user_id:[return in response of login api]
               feed:[feedback]
```

## Notification Action

### Request URL for Notifications 

```
* URL: BASEURL/notifications/list
* HTTP Methods: GET
* PARAMETERS:  user_id:[return in response of login api]
```

## Offer Action

### Request URL for Create Offers  

```
* URL: BASEURL/offers/create
* HTTP Methods: POST
* PARAMETERS:  user_id:[return in response of login api]
               amount:3
               currency:SwiftCoin
               unit:STC
               type:b //[User wnat to buy or sell]
```

### Request URL for Offers  

```
* URL: BASEURL/offers
* HTTP Methods: GET
* PARAMETERS:  user_id:[return in response of login api]
```

 
