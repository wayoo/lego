<template>
  <div>
    <template v-if="data.rootElem">
      <el-form-item label="列数" prop="resource">
        <el-radio-group v-model="form.layout" size="mini" @change="onLayoutChange">
          <el-radio-button label="two">两</el-radio-button>
          <el-radio-button label="three">三</el-radio-button>
          <el-radio-button label="four">四</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </template>
    <template v-else>
      <el-form-item label="width">
        <el-input v-model="form.width" @keydown.native="onKeyDown($event, 'width')"></el-input>
      </el-form-item>
      <el-form-item label="margin">
        <el-input v-model="form.margin" @keydown.native="onKeyDown($event, 'margin')"></el-input>
      </el-form-item>
    </template>
  </div>
</template>

<script>
let i = 0;
function idGenerator() {
  i += 1;
  return `c_${new Date() - 0}${i}`;
}

/* eslint-disable no-underscore-dangle */
export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
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
    onKeyDown(e, type) {
      if (e.keyCode !== 13) { return; }

      if (type === 'width') {
        if (this.form.width) {
          this.data.style.flex = undefined;
          this.data.style.width = `${this.form.width}px`;
        } else {
          // console.error('rest !');
          this.data.style.flex = 1;
          this.data.style.width = undefined;
        }
      } else if (type === 'margin') {
        this.data.style.margin = this.form.margin;
      }
      console.log(this.data.__ob__.dep.id, this.data.style);

      this.$emit('change');
    },
  },
};
</script>
