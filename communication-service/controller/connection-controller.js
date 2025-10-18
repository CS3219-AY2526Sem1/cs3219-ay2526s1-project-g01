const ConnectionController = {

    offerConnection: (req, res) => {
        console.log("Received offer connection request");
        // Handle offer connection logic here
        res.status(200).json({ message: "Offer connection handled" });
    },

    answerConnection: (req, res) => {
        console.log("Received answer connection request");
        // Handle answer connection logic here
        res.status(200).json({ message: "Answer connection handled" });
    },  

};

module.exports = ConnectionController;