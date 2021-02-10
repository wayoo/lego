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
    const blockData = this.data;
    console.log(blockData);
    return {
      form: {
        content: blockData.content,
      },
    };
  },
  methods: {
    onContentChange(val) {
      this.data.content = val;
      this.$emit('change');
    },
  },
};
</script>
