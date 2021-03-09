<template>
  <div>
    <el-form-item label="mWidth">
      <el-input v-model="form.width" @keydown.native="onKeyDown($event, 'width')"></el-input>
    </el-form-item>
    <el-form-item label="margin">
      <el-input v-model="form.margin" @keydown.native="onKeyDown($event, 'margin')"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    this.data.style = this.data.style || {};
    return {
      form: {
        width: this.data.style.width,
        margin: this.data.style.margin,
      },
    };
  },
  methods: {
    onKeyDown(e, type) {
      if (e.keyCode !== 13) { return; }

      if (type === 'width') {
        this.data.style.maxWidth = `${this.form.width}px`;
      } else if (type === 'margin') {
        this.data.style.margin = this.form.margin;
      }

      this.$emit('change');
    },
  },
};
</script>
