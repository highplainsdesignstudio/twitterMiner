# HPDS Twitter Data Miner

This is a data miner for Twitter information. It requires a Twitter application
keys, Node.js, the Node Package Manager, and Bower. The app opens on the localhost
on port 3000 by default. Currently, it allows you to 
* Search through Twitter tweets using a standard Twitter search query.
* Stores the returned tweets in JSON format in the bin/data folder. 
* Choose from 3 word clouds to display. 
* Embed the tweets that were returned.

## Getting Started

In order to install this application, navigate to the twitterMiner directory that
was cloned from git and enter the following commands in the terminal:

npm install
bower install

The first command will install necessary Node modules, the second will install
bower modules for front end frameworks. After these modules have been installed,
personal Twitter application keys must be added in the bin/env_variables.js file.

In order to find out more information about obtaining keys for a twitter application,
go to the [Twitter Developers](https://dev.twitter.com/) website. Keys for existing
applications can be found in the [My apps](https://apps.twitter.com/) section.

After npm and bower modules have been installed, and Twitter application keys have
been added to the env_variables.js file, you can start this application with 
the command:

npm start

If your default browser does not automatically open, navigate a tab to localhost:3000
to open the application.

### Prerequisites

[Node JS](https://nodejs.org/en/)
[Bower](https://bower.io/)
[Twitter Developers Application Keys](https://dev.twitter.com/)


## Built With

* [Node JS](https://nodejs.org/en/)- The web server.
* [Express JS](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
* [Bower](https://bower.io/) - A package manager for the web.


## Contributing

If you would like to help contribute to this data mining project, contact 
Michael @ High Plains Design Studio using the email admin@highplainsdesignstudio.com. 


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see 
[v1.2.0](https://github.com/highplainsdesignstudio/twitterMiner). 

## Authors

* **Michael Hernandez** - *Initial work* - [HighPlainsDesignStudio](https://github.com/highplainsdesignstudio)

[High Plains Design Studio](http://www.highplainsdesignstudio.com)

See also the list of [contributors](https://github.com/highplainsdesignstudio/twitterMiner/graphs/contributors) who participated in this project.

## License

This project is licensed under the GNU AGPLv3 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to the open source community that contributed all the technology required to get this project started.