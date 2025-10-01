<script setup>
import { computed } from 'vue';
const props=defineProps({
    icon:{
        type:String,
        required:true
    },
    bgColor:{
        type:String,
        default:'bg-slate-200'
    },
    iconSize:{
        type:String,
        default:'w-12 h-12'

    }
  
})

//用import.meta.url生成图片路径
const imageUrl=computed(()=>
    new URL(props.icon,import.meta.url).href
)
</script>
<template>
<div class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg"
:class="bgColor"
>
<img 
class="rounded-lg"
:class="iconSize"
 :src="imageUrl" 
 alt="icon" >
</div>
</template>