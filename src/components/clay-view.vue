<script>
    import Renderer from '@/renderer.js';

    export default {
        props: {
            blueprint: {
                type: Object,
                required: true,
            },
        },

        data() {
            return {
                clayRenderer: new Renderer(this, require('jexl')),
                renderedBlueprint: {},
                h: () => {
                },
            };
        },

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
                this.clayRenderer.render(this.$createElement, this.blueprint)
                    .then(renderedBlueprint => {
                        this.renderedBlueprint = renderedBlueprint;
                    });
            }
        },

        render(h) {
            this.h = h;

            return this.renderedBlueprint;
        },
    };
</script>
