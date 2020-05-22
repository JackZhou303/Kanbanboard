const mongoCollections = require("../config/mongoCollections");
const cards = mongoCollections.cards;
const {ObjectId} = require('mongodb');


module.exports = {

    async parseId(id){
        let parsedId;
        try { 
            parsedId = ObjectId.createFromHexString(String(id));
        } catch (e) {
            throw "ObjectId is invalid.";
        }
        return parsedId;
    },

    async getCardById(id){
        const cardsCollection = await cards();
        if (!id) throw "You must provide an id to search for";
        let parsedId= await this.parseId(id);
        
        const found_card = await cardsCollection.findOne({_id: parsedId});
        if (found_card === null) throw "Could not find the task.";
        return found_card;
    },

    async getCards(){

        const cardsCollection = await cards();
        let allCards = await cardsCollection.find({}).toArray();
         console.log(allCards)
        return allCards;
    
    },

    async createCard(id, category, content, type){

        const cardsCollection = await cards();
    
        let newCard = {
        id: id,
        category: category,
        content: content,
        type: type
        };
        
        const insertInfo = await cardsCollection.insertOne(newCard);
        if (insertInfo.insertedCount === 0) throw "Cannot not add the card.";
    
        let newId = insertInfo.insertedId;
    
        const card = await this.getCardById(newId);
        
        return card;
    },

    async updateCard(id, body) {
        const cardsCollection = await cards();
        
        let parsedId=await this.parseId(id);
        
        const updatedInfo=await cardsCollection.updateOne({_id: parsedId}, {$set: body});

        if (updatedInfo.modifiedCount === 0)
            throw "Cannot not update the task successfully.";
        
        return oldTask;
        
     },

};
