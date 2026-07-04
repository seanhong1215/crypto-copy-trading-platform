<template>
    <div style="height: 100%">
        <div class="slogan">
            <h1 style="font-size: 52px;font-weight: bold; width:100%; color: var(--ink-primary);">全球布局，科技向上</h1>
            <h1 style="width: 100%; color: var(--ink-secondary);">Global layout, Technology advances</h1>
        </div>
        <div class="main-wapper">
            <div class="body-wapper">
                <div ref="earth" v-if="alive" class="earth-container earth-ready earth-draggable gai-body ">
                    <!-- <div class="glow"></div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import store from "@/store";
    import CNavbar from "@/components/common/navbar";
    import CFooter from "@/components/common/footer";

    export default {
        store,
        name: "Index",
        data() {
            return {
                Img: "static/img/index/",
                alive: true,
                connections: [
                    [11.512345, 106.847567, 29.365778, -4.564955],
                    [11.512345, 106.847567, 20.954182,-126.927526],

                    [10.385808, 88.95618, 29.365778, -4.564955],
                    [10.385808, 88.95618,29.365778, -4.564955],

                    // 欧洲
                    [29.365778, -4.564955],
                    [29.365778, -4.564955],

                    // 美国西
                    [20.954182,-126.927526],
                    [20.954182,-126.927526],

                    // 纽约
                    [19.885552, -85.578189, -31.780645,-48.02152],
                    [19.885552, -85.578189, -31.780645,-48.02152],

                    // 加拿大
                    [35.664369,-92.646816],
                    [35.664369,-92.646816],


                    // 巴西
                    [-31.780645,-48.02152, -55.129902, 124.779782],
                    [-31.780645,-48.02152, -55.129902, 124.779782],


                    // 澳大利亚
                    [-55.129902, 124.779782],
                    [-55.129902, 124.779782],
                ],
                sprites: [],
                offset: 1
            };
        },
        components: {
            CNavbar, CFooter
        },
        mounted() {
            this.init_earth()
        },
        destroyed(){
            this.alive =false
            // this.earth_charts.dispose()
        },
        methods: {
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            },
            pulse(index) {
                var self = this
                var random_location = this.connections[this.getRandomInt(0, this.connections.length - 1)];
                this.sprites[index].location = {
                    lat: random_location[0] * self.offset,
                    lng: random_location[1] * self.offset
                };

                this.sprites[index].animate('scale', 0.5, {
                    duration: 200,
                    complete: function () {
                        this.animate('scale', 0.2, {
                            duration: 200,
                            complete: function () {
                                setTimeout(function () {
                                    self.pulse(index);
                                }, self.getRandomInt(50, 200));
                            }
                        });
                    }
                });
            },
            init_earth(){
                this.myearth = new Earth(this.$refs.earth, {

                    // 初始化时候的定位
                    location: {
                        lat: 0,
                        lng: 100
                    },
                    mapImage: require('@/assets/earth/world.jpeg'),
                    light: 'simple',
                    zoom: 1.2,
                    // 是否半透明
                    transparent: false,

                    autoRotate: true,
                    // 自动旋转速度
                    autoRotateSpeed: 0.8,
                    autoRotateDelay: 500,
                    autoRotateStart: 0,
                    quality: 4,
                    // 能否拖拽旋转
                    draggable: true,
                    // 控制上下转动的幅度
                    dragPolarLimit: 1
                });

                var self = this
                this.myearth.addEventListener("ready", function () {

                    this.startAutoRotate();
                    let flightScale = 1
                    var line = {
                        color: '#009CFF',
                        opacity: 0.25,
                        offset: 0,
                        width: 0.2 * flightScale,
                        offsetFlow: flightScale,
                        dashed: true,
                        dashSize: 0.15 * flightScale,
                        dashRatio : 0.5,
                        clip: 0,
                        alwaysBehind: true
                    };

                    for (var i in self.connections) {
                        line.locations = [{
                            lat: self.connections[i][0] * self.offset,
                            lng: self.connections[i][1] * self.offset
                        }, {
                            lat: self.connections[i][2] * self.offset,
                            lng: self.connections[i][3] * self.offset
                        }];
                        var dashedLine = this.addLine(line);
                        dashedLine.animate( 'clip', 1, { duration: 1000 + 20000/10 } );
                    }

                    for (var i = 0; i < 8; i++) {
                        self.sprites[i] = this.addSprite({
                            image: require('@/assets/earth/circle.svg'),
                            scale: 0.5,
                            offset: 0,
                            opacity: 0.8
                        });
                        self.pulse(i);
                    }
                });
            }
        }
    };
</script>

<style lang="css">
    body {
        height: 100%;
    }

    .main-wapper {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: -1;
    }

    .main-wapper .body-wapper {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: 100%;
        display: flex;
        justify-content: center;
    }

    .gai-body {
        width: 100%;
        max-width: 2400px;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 500;
    }

    .gai-footer {
        z-index: 200;
    }

    @media (min-width:767px) {
        .slogan {
            width: 100%;
            padding: 120px;
            position: fixed;
            top: 20%;
            left: 0;
        }
    }
    @media (max-width:768px) {
        .slogan {
            width: 100%;
            padding: 50px;
            position: absolute;
            margin-top: 30%;
            left: 0;
            z-index: 1;
        }
    }


    /* background glow */

    /* 这里可以设置蓝色底色的大小 */
    @media (min-width:767px) {
        .glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            max-width: 110vh;
            height: 110vh;
            max-height: 110vw;
            transform: translate(-50%, -50%);
            background: radial-gradient(ellipse at center, rgba(0,156,255,0.05) 30%,rgba(0,156,255,0.15) 58%,rgba(0,156,255,0.18) 62%,rgba(0,156,255,0) 70%);
            z-index: 200;
            pointer-events: none;
        }
    }
    @media (max-width:768px) {
        .glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 105vh;
            transform: translate(-50%, -50%);
            background: radial-gradient(ellipse at center, rgba(0,156,255,0.05) 30%,rgba(0,156,255,0.15) 58%,rgba(0,156,255,0.18) 62%,rgba(0,156,255,0) 70%);
            z-index: 200;
            pointer-events: none;
        }
    }

    .earth-container {
        position: relative;
        z-index: 1
    }

    .earth-container::before {
        content: "";
        display: block;
        padding-top: 100%
    }

    .earth-container>canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        user-select: none
    }

    .earth-draggable {
        cursor: all-scroll;
        cursor: -webkit-grab;
        cursor: grab
    }

    .earth-dragging * {
        cursor: all-scroll;
        cursor: -webkit-grabbing !important;
        cursor: grabbing !important
    }

    .earth-clickable {
        cursor: pointer
    }

    .earth-overlay {
        position: absolute;
        top: 0;
        left: 0;
        user-select: none;
        pointer-events: none;
        transform-origin: 0 0
    }

    .earth-overlay a,
    .earth-overlay input,
    .earth-overlay button {
        pointer-events: all
    }

    .earth-hittest {
        position: fixed;
        width: 200vh;
        max-width: 100%;
        top: 0;
        left: 0;
        z-index: 999999
    }

    .earth-hittest svg {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0;
        opacity: 0
    }
</style>