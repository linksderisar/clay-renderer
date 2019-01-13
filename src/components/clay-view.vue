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
                clayRenderer: new Renderer(this),
                renderedBlueprint: {},
                h: () => {
                },
            };
        },

        mounted() {
            this.renderBlueprint();
        },

        watch: {
            blueprint() {
                this.renderBlueprint();
            }
        },
        methods: {
            resetStore() {
                window.location.reload();
            },
            renderBlueprint() {
                this.renderedBlueprint = this.clayRenderer.render(this.h, this.blueprint);
            }
        },

        render(h) {
            this.h = h;
            return this.renderedBlueprint;
        },
    };
</script>
