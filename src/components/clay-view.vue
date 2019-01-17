<script>
    import render from '@/render.mixing.js';
    import Clay from '@/clay.js';

    const clay = new Clay();

    export default {
        mixins: [render],
        props: {
            blueprint: {
                type: Object,
                required: true,
            },
        },
        components: clay.components,
        watch: {
            blueprint: {
                handler() {
                    this.renderBlueprint();
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            resetStore() {
                window.location.reload();
            },
            renderBlueprint() {
                this.start_render(this.$createElement, this.blueprint)
                    .then(renderedBlueprint => {
                        this.renderedBlueprint = renderedBlueprint;
                    });
            }
        },

        render(h) {
            return this.renderedBlueprint;
        },
    };
</script>
