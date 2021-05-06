# sec3_Werewolf: Maidcare Service System

A match-making system and an extension of Grab service which allow customers to hire maid to clean theirs home or places.
This project is a part of subject: **2110336 Software Engineering II (2/2563)**

## Demo

we deploy frontend at **Netlify** and backend on **GCP: Cloud Run**.
!!! not a production ready !!!!

Frontend: [https://maid-care-service.netlify.app/](https://maid-care-service.netlify.app/ "https://maid-care-service.netlify.app/")
Backend: [https://maid-care-service-backend-gvl7x6nqha-de.a.run.app/](https://maid-care-service-backend-gvl7x6nqha-de.a.run.app/ "https://maid-care-service-backend-gvl7x6nqha-de.a.run.app/")

## Getting Started

This is a guide for getting Maidcare Service project to run on your local machine for development and testing purposes.

### Prerequisites

- Node.js ^14.0.0
- yarn
- Docker
- docker-compose

### Installing

1. Clone this repository to your machine

```
$ git clone --repo https://github.com/2110336-SoftwareEngineering2/sec3_Werewolf.git
```

2. In `maid-care-service-frontend` folder (frontend folder), create new `.env` file by copying the template in `.env.example` file.

3. The description for each variable in .env is already commented in the `.env.example` file. However, the variables listed below **need to be left empty** as they are for an _unavailable features_.

```
	# FOR SUBSCRIPTION PUSH NOTIFICATION
	REACT_APP_PUBLIC_VAPID_KEY=
	REACT_APP_PRIVATE_VAPID_KEY=
```

4. In `maid-care-service-backend` folder (backend folder), create new `.env` file by copying the template in `.env.example` file. The description for every variables in in the `.env.example` file as well.
5. In the `docker-compose.yml` file under the backend folder, edit the value of all the `env_file` keys under the service part to your `.env` filename to change the .env filename for development.

```
    version: '3'
    services:
		backend:
	       ....
	       env_file: path/to/your/frontend/.env_filename
	       ....
	    frontend:
		    ....
		    env_file: path/to/your/backend/.env_filename
		    ....
```

6. Back to `maid-care-service-frontend` folder, go to `firebase.js` under `src` directory.
   For the firebaseConfig object, you can change the variables to your own firebase storage configuration.
   Following Firebase's guide

- https://firebase.google.com/docs/web/setup (config object)
- https://firebase.google.com/docs/storage/web/start (firebase storage setup)

```
	// firebase.js
	var firebaseConfig =  {
		apiKey:  		'<your-api-key>',
		authDomain:  	'<your-auth-domain>',
		databaseURL:  	'<your-database-url>',
		storageBucket:  '<your-storage-bucket-url>'
	};
```

7. To run the project, use docker-compose up command at the root directory of the project.

```
	$ docker-compose up
```

8. The web application will launch on `localhost` at port `80`. To use, go to

```
	http://localhost/
```

### In Your Information

Because the assumption that the system as a one of the extensions of Grab service, the system will be used by the same users as Grab system and this is the reason why the system there is no register system for any role of users except maid.

However, the system provides some a user data for each role for testing purpose so you can login as a user in any role and play with the features.

```
	# admin
	email: "admin@example.com"
	password: "password"
	# customer
	email: "user@example.com"
	password: "password"
	# maid
	email: "maid@example.com"
	password: "password"
```
