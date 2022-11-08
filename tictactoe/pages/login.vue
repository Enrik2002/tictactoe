<template>
    <div class="bg-red-400 h-screen flex justify-center flex-col">
        <h1 class="font-sans align-middle flex justify-center text-4xl">Sign in to play</h1>
        <div id="firebaseui-auth-container">

        </div>
        
    </div>

</template>
<script>
export default {
    computed: {
        user() {
            return this.$store.state.user;
        }

    },
    mounted() {
        const firebaseui = require('firebaseui');
        require("firebaseui/dist/firebaseui.css")

        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.$fire.auth);

        const config = {
            signInOptions: [
                this.$fireModule.auth.EmailAuthProvider.PROVIDER_ID,
                this.$fireModule.auth.GoogleAuthProvider.PROVIDER_ID,

            ],
            signInSuccessUrl: '/',
            callbacks: {
                signInSuccesWithAuthResult() {
                    console.log('Logged in');
                    window.location = '/'
                }
            }

        }
        ui.start("#firebaseui-auth-container", config);
    }
}
</script>
