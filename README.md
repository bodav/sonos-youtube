# Node Sonos Youtube service

## Usage

* npm install
* Edit config.json.example and run app.js

## Sonos setup

Go to: http://{IP address of player}:1400/customsd.htm

* SID: ex. 255
* Service Name: <name>
* Endpoint URL: http://host:port/soap
* Secure Endpoint URL: http://host:port/soap
* Polling Interval: 60
* Authentication SOAP Header Policy: Anonymous
* Presentation map: http://host:port/static/PresentationMap.xml
* Strings: http://host:port/static/Strings.xml
* ContainerType: Music Service
* Capabilities: Search