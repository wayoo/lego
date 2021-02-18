<template>
  <div>
    <el-form-item label="列数" prop="resource">
      <el-radio-group v-model="form.layout" size="mini" @change="onLayoutChange">
        <el-radio-button label="two">两</el-radio-button>
        <el-radio-button label="three">三</el-radio-button>
        <el-radio-button label="four">四</el-radio-button>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
let i = 0;
function idGenerator() {
  i += 1;
  return `${new Date() - 0}${i}`;
}

export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
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
        this.data.children[0].props.span = 12;
        this.data.children[1].props.span = 12;
        this.data.children = this.data.children.slice(0, 2);
      }
      if (val === 'three') {
        if (this.data.children.length >= 3) {
          this.data.children = this.data.children.slice(0, 3);
          this.data.children.forEach((col) => {
            // eslint-disable-next-line no-param-reassign
            col.props.span = 8;
          });
        } else {
          this.data.children[0].props.span = 8;
          this.data.children[1].props.span = 8;
          this.data.children.push({
            tag: 'el-col',
            id: idGenerator(),
            name: 'Columns',
            props: {
              span: 8,
            },
            children: [],
          });
        }
      }
      if (val === 'four') {
        if (this.data.children.length === 2) {
          this.data.children[0].props.span = 6;
          this.data.children[1].props.span = 6;
          this.data.children.push({
            tag: 'el-col',
            id: idGenerator(),
            name: 'Columns',
            props: {
              span: 6,
            },
            children: [],
          });
          this.data.children.push({
            tag: 'el-col',
            id: idGenerator(),
            name: 'Columns',
            props: {
              span: 6,
            },
            children: [],
          });
        } else if (this.data.children.length === 3) {
          this.data.children[0].props.span = 6;
          this.data.children[1].props.span = 6;
          this.data.children[2].props.span = 6;
          this.data.children.push({
            tag: 'el-col',
            id: idGenerator(),
            name: 'Columns',
            props: {
              span: 6,
            },
            children: [],
          });
        }
      }

      this.$emit('change');
    },
  },
};
</script>
