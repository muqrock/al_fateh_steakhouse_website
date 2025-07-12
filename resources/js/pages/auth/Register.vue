export default { data() { return { form: { name: '', email: '', password: '', password_confirmation: '', } } }, methods: { submit() {
this.$inertia.post('/register', this.form) } } }
