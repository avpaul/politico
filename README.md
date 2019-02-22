# Politico
[![Build Status](https://travis-ci.com/avpaul/politico-db.svg?branch=develop)](https://travis-ci.com/avpaul/politico-db)
[![Coverage Status](https://coveralls.io/repos/github/avpaul/politico-db/badge.svg?branch=develop)](https://coveralls.io/github/avpaul/politico-db?branch=develop&kill_cache=1) 
[![codecov](https://codecov.io/gh/avpaul/politico-db/branch/develop/graph/badge.svg)](https://codecov.io/gh/avpaul/politico-db)
[![Maintainability](https://api.codeclimate.com/v1/badges/c089097efa55232f6aed/maintainability)](https://codeclimate.com/github/avpaul/politico-db/maintainability)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="http://avpaul.github.io/politico">
    <img
      alt="Politico"
      src="http://avpaul.github.io/politico/UI/assets/Politico_256-72.svg"    
      width="500"
    />
  </a>
</p>

We are used to _*ballot box elections*_ and the whole process it takes until we get election results.
Polling places, ballot box, ballot paper, counting votes and so on can be expensive and tedious.
Technology especially internet powers many things nowadays from booking your next vacation ticket 
to doing business across the five continents from home! It's time to take our elections online :computer: :+1:

>The ballot box election is the traditional form of voting 
>which takes place directly at the polling place.

*Politico* is a digital voting system which make use of internet to allow people to vote in an 
election and have there votes counted online.

### Gh-pages and heroku app links
Politico front end is hosted on gh-pages [Politico UI](http://avpaul.github.io/politico) and the API end points are hosted on heroku [Politico API](https://peoplevotedb.herokuapp.com)

### Framework and Technologies used
*Built with*
* [Nodejs](https://www.nodejs.org)
* [Expressjs](https://www.expressjs.com)

*API end-points tested by*
* [Mocha](https://www.mochajs.org) & [Chai](chaijs.com)
* [Postman](https://www.getpostman.com)

*Continuous Integration and test coverage by*
* [Travis Ci](https://www.travis-ci.org) for CI
* [Coveralls](https://www.coveralls.io) for test coverage

### Installation
Clone this repo locally and install dependencies
```
$ git clone https://github.com/avpaul/politico-db.git 
$ cd ./politico-api
$ npm install
```
To start the application run `npm start` or use [Nodemon](https://www.nodemon.io) for restarting server on save.
### Features
- Create a political party
- Delete a political party
- Create a government office
- Edit a party's entries
- Get all created political parties
- Get a specific political party
- Get all created political offices
- Get a specific political office

#### Endpoints to create, views available products and create sale records
*HTTP Method*|*End point* | *Public Access*|*Action*
:----------|:---------|:------------:|:-----
POST | /v1/parties | true | Create a political party
GET | /v1/parties | true | Fetch all ​ political parties​ records
GET | /v1/parties/<parties_id> | true | Fetch a specific ​ political party​ record
PATCH | /V1/parties/<parties_id>/name | true | Edit the name of a specific ​ political party​
PUT | /v1/parties/<parties_id> | true | Edit details of a of a specific ​ political party
DELETE | /v1/parties/<parties_id> | true | Delete a specific ​ political party
POST | /v1/office | true | Create a ​ political office
GET | /v1/office | true | Fetch all ​ political offices​ records
GET | /v1/offices/<office_id> | true | Fetch a specific ​ political office​ record

### Tests
```
$ npm test
```

![test results](UI/assets/test.png)

### License
MIT &COPY; [avpaul](https://www.github.com/avpaul)
