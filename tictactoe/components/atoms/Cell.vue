<template>
<div class="cell" @click="emitClick()" >
</div>
</template>


<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data() {
        return {}
    },
    props: {
        index:{
            
        },
        disabled: {
            
        }
    },
    methods: {
        emitClick() : void {
            if(!this.disabled) this.$emit('toggle',this.index)
        }
    }
})
</script>