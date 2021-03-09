<template>
  <div>
      <el-input type="textarea" rows="20" v-model="form.content"
        @input="onContentChange"></el-input>
  </div>
</template>

<script>
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
        content: this.data.props.data.content,
      },
    };
  },
  methods: {
    onContentChange(val) {
      this.data.props.data.content = val;
      this.$emit('change');
    },
  },
};
</script>
