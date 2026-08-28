<template>
    <div style="height: 100%">
        <c-navbar/>
        <router-view/>
        <c-footer/>
    </div>
</template>

<script>
    import CNavbar from "@/components/common/navbar.vue";
    import CFooter from "@/components/common/footer.vue";
    export default {
        components: {
            CNavbar, CFooter
        }
    }

</script>
