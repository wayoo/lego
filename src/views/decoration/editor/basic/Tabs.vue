<template>
  <div>
    <div v-if="data.rootElem">
      <div :key="item.id" v-for="(item, k) in form.tabs">
        <el-form-item :label="`Tab ${k+1}`">
          <el-input v-model="item.props.label"
            @keydown.native="onKeyDown($event, 'width')"></el-input>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
// import { idGenerator } from '../../common/utils';
import { idGenerator } from '../../common/utils';

/* eslint-disable no-underscore-dangle */
export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    console.log(this.data);
    return {
      form: {
        tabs: this.data.children,
        width: this.data.style.width,
        margin: this.data.style.margin,
        layout: this.calLayout(),
      },
    };
  },
  methods: {
    calLayout() {
      let label = '';
      switch (this.data.children.length) {
        case 2:
          label = 'two';
          break;
        case 3:
          label = 'three';
          break;
        case 4:
          label = 'four';
          break;
        default:
          label = '';
          break;
      }
      return label;
    },
    onLayoutChange(val) {
      if (val === 'two') {
        this.data.children = this.data.children.slice(0, 2);
      }
      if (val === 'three') {
        if (this.data.children.length >= 3) {
          this.data.children = this.data.children.slice(0, 3);
        } else {
          this.data.children.push({
            tag: 'div',
            id: idGenerator(),
            name: 'Flexs',
            style: {
              flex: 1,
            },
            children: [],
          });
        }
      }
      if (val === 'four') {
        while (this.data.children.length < 4) {
          this.data.children.push({
            tag: 'div',
            id: idGenerator(),
            name: 'Flexs',
            style: {
              flex: 1,
            },
            children: [],
          });
        }
      }

      this.$emit('change');
    },
    onKeyDown(e) {
      if (e.keyCode !== 13) { return; }

      this.$emit('change');
    },
  },
};
</script>
