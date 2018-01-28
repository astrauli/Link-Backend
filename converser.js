const NLP = require('./NLP.js');
const GoogleMap = require("./google_map");
const Promise = require("es6-promise");

const sampleTexts = "'I am looking for a homeless shelter' or  'I need drug counseling'";
// STATUSES
const FILLING_QUERY = "FILLING_QUERY";
const CONFIRMING_ADDRESS = "CONFIRMING_ADDRESS";

const defaultQuery = {service: null, address: null, status: "FILLING_QUERY"};

class Converser{
  constructor(query = defaultQuery, user){
    this.query = query;
    this.user = user;
  }



  receiveText(text){
    if (this.query === defaultQuery){
      return this.receiveService(text);
    } else if (!this.query.address){
      return this.receiveAddress(text);
    } else if (this.query.status === CONFIRMING_ADDRESS){
      return this.fulfillQuery();
    }
  }

  receiveService(text){
    let response;
    let promise = new Promise((resolve, reject) => {
      if (!this.query["service"]){
        const parser = new NLP(text);
        parser.parseService().then(entities => {
          if (this.handleEntites(entities)){
            response = "Where are you currently? (ex. 587 Eddy St.)";
            // save to DB
          } else{
            response = "Sorry, I wasn't able to understand that. Try " + sampleTexts;
          }
            console.log(response);
        });
      }
    });
  }
  // receiveText(text){
  //   let response;
  //   let promise = new Promise((resolve, reject) => {
  //     if (!this.query["service"]){
  //       const parser = new NLP(text);
  //       parser.parseService().then(entities => {
  //         if (this.handleEntites(entities)){
  //           response = "Where are you currently? (ex. 587 Eddy St.)";
  //           // save to DB
  //         } else{
  //           response = "Sorry, I wasn't able to understand that. Try " + sampleTexts;
  //         }
  //         console.log(response);
  //       });
  //     } else{
  //       this.query["address"] = text;
  //       const googleMap = new GoogleMap(this.query.service, this.query.address);
  //       googleMap.getText()
  //         .then(console.log);
  //       // response = this.lookupQuery(this.query.service, this.query.address);
  //       // console.log(response);
  //     }
  //     resolve(this.query);
  //   });
  //   return promise;
  // }

  handleEntites(entities){
    if (entities.length > 0){
    //  this.query["service"] = entities[0];
     this.query["service"] = entities;
     return true;
    } else{
      return false;
    }
  }


  returnResponse(response){
    console.log(response);
  }

}
module.exports = Converser;
