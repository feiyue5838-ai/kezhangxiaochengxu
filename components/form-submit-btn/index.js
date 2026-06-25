// components/form-submit-btn/index.js
Component({
  properties: {
    enabled: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    onSubmit() {
      if (this.data.enabled) {
        this.triggerEvent('submit');
      }
    }
  }
});
