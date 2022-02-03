
Requirement:
* [Docker]
* [Node] LTS version
* [MySql] 5.7

##API Spec:  Api Spec is provided inside api-spec directory. i have used swagger for creating api spec. To view spec please copy generated-spec.yaml to editor.swagger.io or use vscode plugin to visualize api spec.



##Test Cases: I have covered majority of test cases please run 

```sh
npm test
```

##Starting app :

```sh
docker-compose up
```

The will Init DB and seed with dummy data. 

I have included seed data in sql file but there is js script as well that leverage api to seed db.

Node api will server on port 80

you can use curl/postman or any other tool to test api.  
