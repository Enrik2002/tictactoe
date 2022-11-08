import {getFirestore} from "firebase/firestore"
export default class Database {
    
    fields = [
        {
            num: 0,
            type: "empty",
        },
        {
            num: 1,
            type: "empty",
        },
        {
            num: 2,
            type: "empty",
        },
        {
            num: 3,
            type: "empty",
        },
        {
            num: 4,
            type: "empty",
        },
        {
            num: 5,
            type: "empty",
        },
        {
            num: 6,
            type: "empty",
        },
        {
            num: 7,
            type: "empty",
        },
        {
            num: 8,
            type: "empty",
        },
    ];
    circleTurn = false;
    constructor() {
        this.retrieveData();
    }
    retrieveData = () => {
        const db = getFirestore().firestore;
        const doc = db.collection('game').doc('fTszHsjDkmRRLmyvBw4c');
        doc.onSnapshot(docSnapshot => {
            console.log(docSnapshot.data());
            this.fields = docSnapshot.data().Position;
            this.circleTurn = docSnapshot.data().Playerturn;
            if (docSnapshot.data().Position == '') {
                this.updateDBIfEmpty();
            }
        })
    }

    setData = (fields,circleTurn) => {
        const db = this.$fire.firestore;
        const doc = db.collection('game').doc('fTszHsjDkmRRLmyvBw4c');
        doc.update({ Position: fields })
        doc.update({ Playerturn: circleTurn });
    }

    updateDBIfEmpty = () => {
        const db = this.$fire.firestore;
        const doc = db.collection('game').doc('fTszHsjDkmRRLmyvBw4c');
        doc.update({
            Position: [
                {
                    num: 0,
                    type: "empty",
                },
                {
                    num: 1,
                    type: "empty",
                },
                {
                    num: 2,
                    type: "empty",
                },
                {
                    num: 3,
                    type: "empty",
                },
                {
                    num: 4,
                    type: "empty",
                },
                {
                    num: 5,
                    type: "empty",
                },
                {
                    num: 6,
                    type: "empty",
                },
                {
                    num: 7,
                    type: "empty",
                },
                {
                    num: 8,
                    type: "empty",
                },
            ]
        })
    }
}



