import React, { useEffect } from 'react'
import "./Background.css"
import { useAppDispatch } from './app/hooks'
import { setBackgroundGenerated } from './app/gameSlice'

interface BackgroundProps {
    pollutionRate: number // 0.0 to 1.0
}

const Background: React.FC<BackgroundProps> = ({ pollutionRate }) => {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const colsRef = React.useRef<HTMLCanvasElement | null>(null)
    const dispatch = useAppDispatch()

    // Render only once
    useEffect(() => {
        const cols_ = colsRef.current
        if (!cols_) {
            console.error('Canvas element with id "cols" not found.')
            return
        }
        const cols = cols_

        const col_ctx = cols.getContext('2d')
        if (!col_ctx) {
            console.error('2D context for "cols" canvas not found.')
            return
        }

        let grd = col_ctx.createLinearGradient(0, 0, cols.width, 0)
        grd.addColorStop(0.0, '#004') // depths
        grd.addColorStop(0.45, '#04f') // sea
        grd.addColorStop(0.48, '#fff') // waves
        grd.addColorStop(0.5, 'rgba(223, 255, 197, 1)') // sand
        grd.addColorStop(0.51, '#040') // greens
        grd.addColorStop(0.6, '#2b0') // greens
        grd.addColorStop(0.66, '#640') // browns
        grd.addColorStop(0.72, '#bbb') // greys
        grd.addColorStop(0.79, '#888') // greys
        grd.addColorStop(0.8, '#fff') // snow
        grd.addColorStop(0.99, '#fff') // snow
        grd.addColorStop(0.99, '#876') // edges
        grd.addColorStop(1.0, '#876') // edges
        col_ctx.fillStyle = grd
        col_ctx.fillRect(0, 0, cols.width, cols.height)

        grd = col_ctx.createLinearGradient(0, 0, 0, cols.height)
        grd.addColorStop(0.0, 'rgba(255,255,255, 1.0)') // lit up
        grd.addColorStop(0.5, 'rgba(0,0,0,       0.0)') // start of shadow
        grd.addColorStop(0.53, 'rgba(0,0,0,       0.6)') // start of shadow
        grd.addColorStop(0.85, 'rgba(0,0,0,       0.8)') // deepest shadow
        col_ctx.fillStyle = grd
        col_ctx.fillRect(0, 0, cols.width, cols.height)

        const coltab: string[][] = new Array(cols.width + 1)
        for (let cx = 0; cx <= cols.width; cx++) {
            coltab[cx] = new Array(cols.height + 1)
            for (let cy = 0; cy <= cols.height; cy++) {
                const data = col_ctx.getImageData(cx, cy, 1, 1).data
                col_ctx.fillStyle = `rgb(${data[0]},${data[1]},${data[2]})`
                coltab[cx][cy] = col_ctx.fillStyle
            }
        }

        const canvas_ = canvasRef.current
        if (!canvas_) {
            console.error('Canvas element with id "landscape" not found.')
            return
        }
        const canvas = canvas_

        const ctx_ = canvas.getContext('2d')
        if (!ctx_) {
            console.error('2D context for "landscape" canvas not found.')
            return
        }
        const ctx = ctx_

        const width = 256 // must be a power of 2
        const stars = 100 // can be any number

        const land: number[][] = []
        const colx: number[][] = []
        for (let i = 0; i <= width; i++) {
            land.push(new Array(width + 1))
            colx.push(new Array(width + 1))
        }

        const starx: number[] = new Array(stars)
        const stary: number[] = new Array(stars)
        const int = Math.floor

        generate()
        let sunht = Math.random() * 5
        draw3d()

        dispatch(setBackgroundGenerated())

        function draw3d() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (let n = 0; n < stars; n++) {
                const c = int(5 + rand(5))
                ctx.fillStyle = `#${c}${c}${c}`
                ctx.fillRect(starx[n], stary[n], 2, 2)
            }

            const origin_x = canvas.width / 2
            const origin_y = canvas.height / 2 - (canvas.height - width) / 2.5
            for (let lat = 0; lat < width; lat++) {
                const ox = origin_x + lat * 2
                const oy = origin_y + lat
                let shadow = land[lat][0]
                for (let lon = 1; lon < width; lon++) {
                    const ht = land[lat][lon]
                    ctx.fillStyle =
                        coltab[colx[lat][lon]][
                            int(
                                limit(
                                    0,
                                    shadow - ht + cols.height / 2,
                                    cols.height - 1
                                )
                            )
                        ]
                    ctx.fillRect(ox - lon * 2, oy + lon - ht, 2, 10)
                    shadow = shadow - sunht
                    if (shadow < ht) {
                        shadow = ht
                    }
                }
            }

            for (let lat = 0; lat <= width; lat++) {
                ctx.fillStyle = coltab[995][cols.height - 1]
                ctx.fillRect(
                    origin_x + lat * 2 - width * 2,
                    origin_y + lat + width + 10,
                    2,
                    -10 - land[lat][width]
                )
                ctx.fillStyle = coltab[995][cols.height * 0.6]
                ctx.fillRect(
                    origin_x + width * 2 - lat * 2,
                    origin_y + width + lat + 10,
                    2,
                    -10 - land[width][lat]
                )
            }
        }

        function generate() {
            land[0][0] = noise(100)
            land[width][0] = noise(100)
            land[0][width] = noise(100)
            land[width][width] = noise(100)

            for (let gridsize = width / 2; gridsize >= 1; gridsize = int(gridsize / 2)) {
                halflon(gridsize)
                halflat(gridsize)
            }

            for (let lat = 0; lat <= width; lat++) {
                for (let lon = 0; lon <= width; lon++) {
                    colx[lat][lon] = limit(
                        0,
                        int(land[lat][lon] * 2 + noise(0) + cols.width / 2),
                        980
                    )
                    land[lat][lon] = limit(2, land[lat][lon] + noise(0), 999)
                }
            }

            for (let n = 0; n < stars; n++) {
                starx[n] = rand(canvas.width)
                stary[n] = rand(canvas.height)
            }
        }

        function halflon(gridsize: number) {
            for (let lat = 0; lat <= width; lat += gridsize * 2) {
                for (let lon = gridsize; lon <= width; lon += gridsize * 2) {
                    land[lat][lon] =
                        (land[lat][lon - gridsize] +
                            land[lat][lon + gridsize] +
                            noise(gridsize * 3)) /
                        2
                }
            }
        }

        function halflat(gridsize: number) {
            for (let lat = gridsize; lat <= width; lat += gridsize * 2) {
                for (let lon = 0; lon <= width; lon += gridsize) {
                    land[lat][lon] =
                        (land[lat - gridsize][lon] +
                            land[lat + gridsize][lon] +
                            noise(gridsize * 3)) /
                        2
                }
            }
        }

        function limit(min: number, x: number, max: number): number {
            return x < min ? min : x > max ? max : x
        }

        function rand(max: number): number {
            return Math.random() * max
        }

        function noise(max: number): number {
            return rand(max) - rand(max)
        }
    }, [])

    return (
        <div className="background">
            <canvas 
                className='background-canvas' 
                ref={canvasRef} 
                width="1200" 
                height="800"
                style={{ filter: `grayscale(${pollutionRate})` }}
            >
                Your browser does not support the canvas element.
            </canvas>

            <canvas
                className='background-cols'
                ref={colsRef}
                width="1000"
                height="80"
                style={{ display: 'block' }}
            ></canvas>
        </div>
    )
}

export default Background
