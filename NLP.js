const language = require('@google-cloud/language');

class NLP{
  constructor(message){
    this.message = message;
  }

  sendReq(){
    const client = new language.LanguageServiceClient();

    const document = {
      content: this.message,
      type: 'PLAIN_TEXT',
    };

    return client
    .analyzeEntities({document: document})
    .catch(err => {
      console.error('ERROR:', err);
    });
  }

  parseService(){
    let promise = new Promise((resolve, reject) =>{
    this.sendReq()
      .then(
        response =>{
          let entities = response[0].entities.map(entity => entity.name);
          resolve(entities);
        },
      errors => reject(errors));
    });
    return promise;
  }
}

module.exports = NLP;
// const post = new NLP("I am looking for a soup kitchen");
// post.parseService();