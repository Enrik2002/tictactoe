<template>
  <div class="bg-gradient-to-r from-red-400 ...">
    <div class="flex justify-around">
    <h1 class="font-sans text-3xl w-2/5">TicTacToe!</h1>
    
    <h2>User: {{ user?.email }}</h2>
    <h3>Current game-id: {{ docId }}</h3>
    <div>

    </div>
    <button @click="signOut()" class="bg-red-700 p-2 rounded-md font-bold">Sign out</button>
    </div>
    <div class="flex flex-col justify-center">
      <div class="text-center w-full text-4xl">{{ players[0] }} VS {{ players[1] }}</div>
      <div :class="`board ${circleTurn ? 'circle' : 'x'}`" id="board">
        <Cell :index="index" :disabled="playertype === circleTurn" v-for="(item, index) in fields" @toggle="toggleField"
          :class="item.type"></Cell>

      </div>
    </div>
    <div class="winning-message show" id="winningMessage" v-if="showWinner">
      <div>{{ winningMessage }}</div>
      <button id="restartButton" @click="startGame()">Restart</button>
    </div>
  </div>

</template>

<script lang="ts">
import FieldType from '~/enums/FieldType'
import Field from '~/types/Field'
import Cell from './atoms/Cell.vue'
import Vue from "vue"
export default Vue.extend({
  name: 'NuxtTutorial',
  components: { Cell },
  data() {
    return {
      X_CLASS: 'x',
      CIRCLE_CLASS: 'circle',
      circleTurn: false,
      cellElements: [],
      board: '',
      winningMessageElement: '',
      restartButton: '',
      winningMessage: '',
      showWinner: false,
      docId: '',
      players: [],
      playertype: true,


      winningpossibilities: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
      ],
      fields: [
        {
          num: 0,
          type: FieldType.EMPTY,
        },
        {
          num: 1,
          type: FieldType.EMPTY,
        },
        {
          num: 2,
          type: FieldType.EMPTY,
        },
        {
          num: 3,
          type: FieldType.EMPTY,
        },
        {
          num: 4,
          type: FieldType.EMPTY,
        },
        {
          num: 5,
          type: FieldType.EMPTY,
        },
        {
          num: 6,
          type: FieldType.EMPTY,
        },
        {
          num: 7,
          type: FieldType.EMPTY,
        },
        {
          num: 8,
          type: FieldType.EMPTY,
        },
      ]
    }
  },
  mounted() {
    this.findGame();


  },
  computed: {
    user() {
      if (this.$store.state.user) return this.$store.state.user;
      else window.location = "/login"

    }

  },
  methods: {
    toggleField(fieldNumber: number): void {
      if (this.fields[fieldNumber].type === FieldType.EMPTY) {
        this.circleTurn ? this.fields[fieldNumber].type = FieldType.CIRCLE : this.fields[fieldNumber].type = FieldType.CROSS;

        if (this.checkWin(this.circleTurn ? FieldType.CIRCLE : FieldType.CROSS, this.fields, this.winningpossibilities)) {
          this.endGame(false);
        } else if (this.isDraw()) {
          this.endGame(true);
        }

        this.circleTurn = !this.circleTurn;
        this.setData();
      }

    },
    signOut() {

      this.$fire.auth.signOut();
      window.location = '/login';
    },
    startGame() {
      this.circleTurn = false;
      this.updateDBIfEmpty();
      this.setBoardHoverClass(this.fields)
      this.showWinner = false;
    },

    endGame(draw: boolean) {
      this.showWinner = true;
      if (draw) {
        this.winningMessage = 'Draw!'
      } else {
        this.winningMessage = `${this.circleTurn ? "O's" : "X's"} Wins!`
      }


    },


    getData() {
      const db = this.$fire.firestore;
      console.log('fetching data with ' + this.docId)
      const doc = db.collection('game').doc(this.docId);

      doc.onSnapshot((docSnapshot: any) => {
        console.log(docSnapshot.data())
        this.fields = docSnapshot.data().position;
        this.circleTurn = docSnapshot.data().Playerturn;
        this.players = docSnapshot.data().players.map(x => { return x.displayName });
        this.checkWin(this.circleTurn ? FieldType.CIRCLE : FieldType.CROSS, this.fields, this.winningpossibilities);
        if (docSnapshot.data().position == '') {
          this.updateDBIfEmpty();
        }
      });


    },
    findGame() {
      const db = this.$fire.firestore;
      const doc = db.collection('game');
      //const query = doc.where('finished', '==', false);
      let foundGame = '';
      doc.get()
        .then((games: Array<Object>) => {
          games.forEach(doc => {
            const data = doc.data();
            if (data.players.length === 1) {
              foundGame = doc.id;
              this.docId = doc.id;
              console.log(foundGame + ' a game with 1 player')
              //this.getData(); // not here
              //if a game with 1 player is found
            }
          });
        })
        .then(() => {

          if (foundGame == '') {
            db.collection('game').add({
              position: this.fields,
              players: [this.user],
              Finished: false,
              Playerturn: this.circleTurn,
            }).then(res => {
              this.docId = res.id;
              this.playertype = true;
              console.log('created game: ' + this.docId);
              this.getData();
            })
          }
          else {
            console.log('getting collection when a game is found')
            const docu = db.collection('game').doc(this.docId);
            docu.get().then((res) => {
              const players = res.data().players;
              players.push(this.user);
              this.docId = res.id;
              console.log('newly created id: ' + res.id)
              docu.update({ players: players });
              this.playertype = false;
              this.getData();
            })

          }
          this.startGame();
        })




    },

    setData() {
      const db = this.$fire.firestore;

      console.log('setdata doc')
      const doc = db.collection('game').doc(this.docId);
      doc.update({ position: this.fields })
      doc.update({ Playerturn: this.circleTurn })
    },
    isDraw() {
      return [...this.fields].every(cell => {
        return cell.type !== FieldType.EMPTY;
      })
    },
    placeMark(cell: Field, currentClass: FieldType) {
      cell.type = currentClass
    },
    swapTurns() {
      this.circleTurn = !this.circleTurn
    },
    setBoardHoverClass(fields: Array<Field>) {
      fields.forEach(field => {
        field.type = FieldType.EMPTY;
      })

    },
    checkWin(currentClass: FieldType, fields: Array<Field>, combinations: Array<Array<number>>): boolean {
      const x = combinations.some((combination: Array<number>) => {
        return combination.every((index: number) => {
          return fields[index].type === currentClass;
        })

      })
      return x
    },
    updateDBIfEmpty() {
      const db = this.$fire.firestore;
      const doc = db.collection('game').doc(this.docId);
      doc.update({
        position: [
          {
            num: 0,
            type: FieldType.EMPTY,
          },
          {
            num: 1,
            type: FieldType.EMPTY,
          },
          {
            num: 2,
            type: FieldType.EMPTY,
          },
          {
            num: 3,
            type: FieldType.EMPTY,
          },
          {
            num: 4,
            type: FieldType.EMPTY,
          },
          {
            num: 5,
            type: FieldType.EMPTY,
          },
          {
            num: 6,
            type: FieldType.EMPTY,
          },
          {
            num: 7,
            type: FieldType.EMPTY,
          },
          {
            num: 8,
            type: FieldType.EMPTY,
          },
        ]
      })
    }
  },



});
</script>
<style>

/*CSS for tictactoe board & cells (CSS below) are from https://github.com/WebDevSimplified/JavaScript-Tic-Tac-Toe */
*,
*::after,
*::before {
  box-sizing: border-box;
}

:root {
  --cell-size: 100px;
  --mark-size: calc(var(--cell-size) * .9);
}

body {
  margin: 0;
}

.board {
  width: 100vw;
  height: 100vh;
  display: grid;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, auto)
}

.cell {
  width: var(--cell-size);
  height: var(--cell-size);
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.cell:first-child,
.cell:nth-child(2),
.cell:nth-child(3) {
  border-top: none;
}

.cell:nth-child(3n + 1) {
  border-left: none;
}

.cell:nth-child(3n + 3) {
  border-right: none;
}

.cell:last-child,
.cell:nth-child(8),
.cell:nth-child(7) {
  border-bottom: none;
}

.cell.x,
.cell.circle {
  cursor: not-allowed;
}

.cell.x::before,
.cell.x::after,
.cell.circle::before {
  background-color: black;
}

.board.x .cell:not(.x):not(.circle):hover::before,
.board.x .cell:not(.x):not(.circle):hover::after,
.board.circle .cell:not(.x):not(.circle):hover::before {
  background-color: lightgrey;
}

.cell.x::before,
.cell.x::after,
.board.x .cell:not(.x):not(.circle):hover::before,
.board.x .cell:not(.x):not(.circle):hover::after {
  content: '';
  position: absolute;
  width: calc(var(--mark-size) * .15);
  height: var(--mark-size);
}

.cell.x::before,
.board.x .cell:not(.x):not(.circle):hover::before {
  transform: rotate(45deg);
}

.cell.x::after,
.board.x .cell:not(.x):not(.circle):hover::after {
  transform: rotate(-45deg);
}

.cell.circle::before,
.cell.circle::after,
.board.circle .cell:not(.x):not(.circle):hover::before,
.board.circle .cell:not(.x):not(.circle):hover::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}

.cell.circle::before,
.board.circle .cell:not(.x):not(.circle):hover::before {
  width: var(--mark-size);
  height: var(--mark-size);
}

.cell.circle::after,
.board.circle .cell:not(.x):not(.circle):hover::after {
  width: calc(var(--mark-size) * .7);
  height: calc(var(--mark-size) * .7);
  background-color: white;
}

.winning-message {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .9);
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  flex-direction: column;
}

.winning-message button {
  font-size: 3rem;
  background-color: white;
  border: 1px solid black;
  padding: .25em .5em;
  cursor: pointer;
}

.winning-message button:hover {


  border-color: white;
}

.winning-message.show {
  display: flex;
}

</style>
