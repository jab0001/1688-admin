<style scoped>
.icon{

  width: fit-content;
  height: fit-content;
  position: absolute;
  right: 7px;
  top: calc(50% - 12px);

}
.icon-flip
{
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);

}
.dropdown {
  --item-display:none;
  width: 100%;
  position: relative;
  display: inline-block;

}
.dropbtn {
  width: 100%;
  background-color: #f8f9fe;
  padding: 16px;
  font-size: 16px;
  border: none;
  color:black;
  text-align: left;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f8f9fe;
  min-width: fit-content;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: var(--item-display) ;

}
.item
{
  cursor: pointer;
}

.show {
  --item-display:block;
}

.changed{
  background: #fff9d7;
}
.dropdown-content a:hover { background-color: hsl(230, 29%, 92%);}

.dropdown:hover .dropdown-content {display: block;}

.dropdown:hover .dropbtn { background-color: hsl(230, 29%, 92%);}
</style>
<template>
  <div ref='dropDownMenu' class="dropdown" @click='onDropMenuClick()' @mouseleave='onDropMenuMouseLeave()'>
    <button :class="{dropbtn:true, changed:isChanged} ">
    {{items[selectedId].name}}
    </button>
    <div :class='{icon: true, "icon-flip": isIconFlip}'>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 14 12" fill="none">
        <path d="M8.73205 11C7.96225 12.3333 6.03775 12.3333 5.26795 11L0.937821 3.5C0.168021 2.16666 1.13027 0.5 2.66987 0.5H11.3301C12.8697 0.5 13.832 2.16667 13.0622 3.5L8.73205 11Z" fill="black"/>
      </svg>
    </div>
    <div class="dropdown-content" v-if='isDropdownOpen'>
      <a
        :class='{item:true, show: isDropdownOpen}'
        v-for="(item, index) in items"
        :key="index"
        @click='onItemClick(index)'
      >
        {{ item.name }}
      </a>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      isIconFlip:false,
      isDropdownOpen:false,
    }
  },
  props: {
    items: {
      type: Array ,
      default: [
       {
          name: "Оплачено"
        },
        {
          name: "Не оплачено"
        }
      ]
    },
    selectedId:{
      type: Number,
      default: 0
    },
    isChanged: {
      type: Boolean,
      default:false
    }
  },
  emits:['select-item'],
  methods:
    {
      onItemClick(index)
      {
        this.isIconFlip = false;
        console.log(this.isDropdownOpen);
        this.$emit('select-item',index)
      },
      onDropMenuClick(){
        this.isIconFlip = !this.isIconFlip
        this.isDropdownOpen =  !this.isDropdownOpen;
        console.log(123);
      },
      onDropMenuMouseLeave(){
        this.isIconFlip = false;
        this.isDropdownOpen =  false;
      }
    },

}
</script>
